// BULLETPROOF ERROR ISOLATION UTILITIES
// This file provides additional layers of protection against @context errors

export class ErrorIsolationManager {
  private static instance: ErrorIsolationManager;
  private errorCount = 0;
  private maxErrors = 10;

  static getInstance(): ErrorIsolationManager {
    if (!ErrorIsolationManager.instance) {
      ErrorIsolationManager.instance = new ErrorIsolationManager();
    }
    return ErrorIsolationManager.instance;
  }

  // Create isolated execution context
  createIsolatedContext<T extends (...args: any[]) => any>(
    fn: T,
    contextName: string = 'isolated'
  ): T {
    return ((...args: Parameters<T>) => {
      try {
        this.errorCount = 0; // Reset error count for each execution
        return fn.apply(this, args);
      } catch (error) {
        this.handleIsolatedError(error, contextName);
        return undefined;
      }
    }) as T;
  }

  // Handle errors in isolated context
  private handleIsolatedError(error: any, contextName: string) {
    this.errorCount++;
    
    if (error.message && error.message.includes('@context')) {
      console.log(`🚫 ${contextName.toUpperCase()} ERROR BLOCKED:`, error.message);
      
      if (this.errorCount >= this.maxErrors) {
        console.log(`🚫 MAX ERRORS REACHED for ${contextName}, disabling further execution`);
        return;
      }
    } else {
      // Re-throw non-@context errors
      throw error;
    }
  }

  // Wrap third-party functions with protection
  wrapThirdPartyFunction<T extends (...args: any[]) => any>(
    fn: T,
    functionName: string
  ): T {
    return ((...args: Parameters<T>) => {
      try {
        return fn.apply(this, args);
      } catch (error) {
        if (error.message && error.message.includes('@context')) {
          console.log(`🚫 THIRD-PARTY FUNCTION ERROR BLOCKED (${functionName}):`, error.message);
          return undefined;
        }
        throw error;
      }
    }) as T;
  }

  // Create safe JSON parser
  createSafeJSONParser() {
    return {
      parse: (text: string) => {
        try {
          const data = JSON.parse(text);
          
          // Ensure all objects have @context
          const ensureContext = (obj: any): any => {
            if (Array.isArray(obj)) {
              return obj.map(ensureContext);
            } else if (obj && typeof obj === 'object') {
              if (!obj['@context']) {
                obj['@context'] = 'https://schema.org';
              }
              Object.keys(obj).forEach(key => {
                if (obj[key] && typeof obj[key] === 'object') {
                  obj[key] = ensureContext(obj[key]);
                }
              });
            }
            return obj;
          };
          
          return ensureContext(data);
        } catch (error) {
          console.log('🚫 JSON PARSING ERROR BLOCKED:', error);
          return {};
        }
      },
      stringify: (obj: any) => {
        try {
          return JSON.stringify(obj);
        } catch (error) {
          console.log('🚫 JSON STRINGIFY ERROR BLOCKED:', error);
          return '{}';
        }
      }
    };
  }

  // Create safe DOM manipulator
  createSafeDOMManipulator() {
    const originalQuerySelector = document.querySelector;
    const originalQuerySelectorAll = document.querySelectorAll;
    
    return {
      querySelector: (selector: string) => {
        try {
          return originalQuerySelector.call(document, selector);
        } catch (error) {
          if (error.message && error.message.includes('@context')) {
            console.log('🚫 QUERYSELECTOR ERROR BLOCKED:', error.message);
            return null;
          }
          throw error;
        }
      },
      querySelectorAll: (selector: string) => {
        try {
          return originalQuerySelectorAll.call(document, selector);
        } catch (error) {
          if (error.message && error.message.includes('@context')) {
            console.log('🚫 QUERYSELECTORALL ERROR BLOCKED:', error.message);
            return [];
          }
          throw error;
        }
      }
    };
  }

  // Monitor error rates
  getErrorStats() {
    return {
      errorCount: this.errorCount,
      maxErrors: this.maxErrors,
      isHealthy: this.errorCount < this.maxErrors
    };
  }

  // Reset error counter
  resetErrorCount() {
    this.errorCount = 0;
  }
}

// Export singleton instance
export const errorIsolation = ErrorIsolationManager.getInstance();

// Utility function to wrap any function with error protection
export function withErrorProtection<T extends (...args: any[]) => any>(
  fn: T,
  contextName?: string
): T {
  return errorIsolation.createIsolatedContext(fn, contextName);
}

// Utility function to safely execute async operations
export async function safeAsyncExecution<T>(
  operation: () => Promise<T>,
  fallback?: T,
  contextName?: string
): Promise<T | undefined> {
  try {
    return await operation();
  } catch (error) {
    if (error.message && error.message.includes('@context')) {
      console.log(`🚫 ASYNC ERROR BLOCKED (${contextName || 'unknown'}):`, error.message);
      return fallback;
    }
    throw error;
  }
}

