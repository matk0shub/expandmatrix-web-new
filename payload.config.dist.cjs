"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// payload.config.ts
var payload_config_exports = {};
__export(payload_config_exports, {
  default: () => payload_config_default
});
module.exports = __toCommonJS(payload_config_exports);

// src/payload/config.ts
var import_path = __toESM(require("path"));
var import_db_mongodb = require("@payloadcms/db-mongodb");
var import_richtext_lexical = require("@payloadcms/richtext-lexical");
var import_nodemailer = __toESM(require("nodemailer"));
var import_payload = require("payload");
var import_sharp = __toESM(require("sharp"));

// src/utils/silenceExperimentalWarnings.ts
if (!global.__silencedSQLiteWarning) {
  process.on("warning", (warning) => {
    if (warning?.name === "ExperimentalWarning" && /SQLite/i.test(warning?.message ?? "")) {
      return;
    }
    console.warn(warning);
  });
  global.__silencedSQLiteWarning = true;
}

// src/payload/collections/FAQ.ts
var FAQ = {
  slug: "faqs",
  admin: {
    useAsTitle: "questionTitle",
    defaultColumns: ["question.cs", "order", "showOnSite", "isFeatured"]
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) {
          return data;
        }
        const czech = data.question?.cs;
        const english = data.question?.en;
        if (czech) {
          data.questionTitle = czech;
        } else if (english) {
          data.questionTitle = english;
        }
        return data;
      }
    ],
    afterRead: [
      ({ doc }) => {
        if (!doc) {
          return doc;
        }
        if (!doc.questionTitle) {
          doc.questionTitle = doc.question?.cs ?? doc.question?.en ?? doc.questionTitle;
        }
        return doc;
      }
    ]
  },
  fields: [
    {
      name: "questionTitle",
      type: "text",
      admin: {
        readOnly: true,
        position: "sidebar"
      }
    },
    {
      name: "question",
      type: "group",
      fields: [
        {
          name: "cs",
          type: "text",
          required: true
        },
        {
          name: "en",
          type: "text",
          required: true
        }
      ]
    },
    {
      name: "answer",
      type: "group",
      fields: [
        {
          name: "cs",
          type: "textarea",
          required: true
        },
        {
          name: "en",
          type: "textarea",
          required: true
        }
      ]
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0
    },
    {
      name: "showOnSite",
      type: "checkbox",
      defaultValue: true,
      label: "Show on website"
    },
    {
      name: "isFeatured",
      type: "checkbox",
      defaultValue: true
    }
  ]
};

// src/payload/collections/FooterLinks.ts
var FooterLinks = {
  slug: "footerLinks",
  labels: {
    singular: "Footer Link Group",
    plural: "Footer Link Groups"
  },
  admin: {
    useAsTitle: "groupTitle",
    defaultColumns: ["groupTitle", "order"]
  },
  access: {
    read: () => true
  },
  fields: [
    {
      name: "groupTitle",
      type: "text",
      required: true,
      localized: true
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0
    },
    {
      name: "links",
      type: "array",
      required: true,
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          localized: true
        },
        {
          name: "href",
          type: "text",
          required: true
        },
        {
          name: "external",
          type: "checkbox",
          defaultValue: false
        }
      ]
    }
  ]
};

// src/payload/collections/Media.ts
var WEBP_OPTIONS = {
  quality: 80,
  alphaQuality: 85,
  smartSubsample: true,
  effort: 6
};
var Media = {
  slug: "media",
  access: {
    read: () => true
    // Allow public read access to media files
  },
  upload: {
    staticDir: "media",
    // Convert uploaded rasters (PNG/JPG) to WebP using tuned options that balance quality and size.
    formatOptions: {
      format: "webp",
      options: WEBP_OPTIONS
    },
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
        // Ensure generated sizes use the same WebP settings
        formatOptions: { format: "webp", options: WEBP_OPTIONS }
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
        formatOptions: { format: "webp", options: WEBP_OPTIONS }
      },
      {
        name: "tablet",
        width: 1024,
        height: void 0,
        position: "centre",
        formatOptions: { format: "webp", options: WEBP_OPTIONS }
      }
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: [
      "image/*",
      "image/svg+xml",
      "application/svg+xml",
      "application/xml",
      "text/xml"
    ]
  },
  fields: [
    {
      name: "alt",
      type: "text"
    }
  ]
};

// src/payload/collections/Partners.ts
var Partners = {
  slug: "partners",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "order", "showOnSite", "updatedAt"],
    description: "Upload partner logos that appear in the \u201COur Partners\u201D section. Entries marked as hidden are excluded from the website."
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;
        if (!data.logoAlt && data.name) {
          data.logoAlt = data.name;
        }
        return data;
      }
    ]
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      required: true
    },
    {
      name: "logoAlt",
      label: "Logo alt text",
      type: "text",
      admin: {
        description: "Defaults to the partner name if left blank."
      }
    },
    {
      name: "scale",
      type: "number",
      admin: {
        description: "Optional size multiplier applied to the logo inside the orbiting ball.",
        step: 0.05
      },
      min: 0.3,
      max: 1.4
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: {
        position: "sidebar"
      }
    },
    {
      name: "showOnSite",
      label: "Show on website",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar"
      }
    }
  ]
};

// src/payload/collections/References.ts
var REQUIRED_LOCALES = ["en", "cs"];
var validateLocalizedField = (fieldLabel) => (value) => {
  if (!value || typeof value !== "object") {
    return `${fieldLabel} mus\xED m\xEDt p\u0159eklady EN i CS`;
  }
  const record = value;
  const missing = REQUIRED_LOCALES.filter((locale) => {
    const localized = record[locale];
    return typeof localized !== "string" || localized.trim().length === 0;
  });
  return missing.length > 0 ? `${fieldLabel}: dopl\u0148 ${missing.join(" a ")} p\u0159eklad` : true;
};
var dualLocaleTextField = ({
  name,
  label,
  description,
  required = false
}) => ({
  name,
  type: "group",
  validate: validateLocalizedField(label),
  admin: {
    description
  },
  fields: REQUIRED_LOCALES.map((locale) => ({
    name: locale,
    label: `${label} (${locale.toUpperCase()})`,
    type: "text",
    required
  }))
});
var References = {
  slug: "references",
  admin: {
    useAsTitle: "slug",
    defaultColumns: ["slug", "order"]
  },
  fields: [
    dualLocaleTextField({
      name: "name",
      label: "Project title",
      description: "N\xE1zev reference v EN i CS",
      required: true
    }),
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the name (e.g., "tech-startup")'
      }
    },
    dualLocaleTextField({
      name: "subtitle",
      label: "Subtitle",
      description: 'Kr\xE1tk\xFD popis (nap\u0159. "AI implementace ve fintech")'
    }),
    {
      name: "instagramUrl",
      type: "text",
      admin: {
        description: "Instagram profile URL (optional)"
      }
    },
    {
      name: "websiteUrl",
      type: "text",
      admin: {
        description: "Official website URL (optional)"
      }
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        description: "Background image for the reference"
      }
    },
    {
      name: "metrics",
      type: "array",
      minRows: 1,
      fields: [
        {
          name: "label",
          type: "group",
          validate: validateLocalizedField("Label"),
          fields: [
            {
              name: "en",
              label: "Label (EN)",
              type: "text",
              required: true
            },
            {
              name: "cs",
              label: "Label (CS)",
              type: "text",
              required: true
            }
          ],
          admin: {
            description: 'Metric label (e.g., "Orders", "Leads", "Revenue")'
          }
        },
        {
          name: "value",
          type: "group",
          validate: validateLocalizedField("Value"),
          fields: [
            {
              name: "en",
              label: "Value (EN)",
              type: "text",
              required: true
            },
            {
              name: "cs",
              label: "Value (CS)",
              type: "text",
              required: true
            }
          ],
          admin: {
            description: 'Metric value (e.g., "887 655 CZK", "9.2 %")'
          }
        }
      ],
      admin: {
        description: "Key performance metrics to display in the stats card (vypl\u0148 EN i CS na jednom m\xEDst\u011B)"
      }
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: {
        description: "Sort order for the references list (lower numbers appear first)"
      }
    }
  ]
};

// src/payload/collections/Subscribers.ts
var Subscribers = {
  slug: "subscribers",
  labels: {
    singular: "Subscriber",
    plural: "Subscribers"
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "locale", "consent", "createdAt"]
  },
  access: {
    read: () => false
    // We'll create via API route; admin manages in CMS
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
      unique: true
    },
    {
      name: "locale",
      type: "text",
      required: true
    },
    {
      name: "consent",
      type: "checkbox",
      required: true,
      defaultValue: false
    }
    // TODO: add verificationToken for double opt-in
  ],
  timestamps: true
};

// src/payload/collections/Team.ts
var Team = {
  slug: "teamMembers",
  admin: {
    useAsTitle: "displayName",
    defaultColumns: ["displayName", "roleDisplay", "order", "featured"]
  },
  fields: [
    {
      name: "displayName",
      type: "text",
      admin: {
        readOnly: true,
        description: "Auto-generated display name for admin interface"
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            const name = data?.name;
            if (name && typeof name === "object") {
              return name.cs || name.en || "Unknown";
            }
            return name || "Unknown";
          }
        ]
      }
    },
    {
      name: "roleDisplay",
      type: "text",
      admin: {
        readOnly: true,
        description: "Auto-generated role display for admin interface"
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            const role = data?.role;
            if (role && typeof role === "object") {
              return role.cs || role.en || "Unknown";
            }
            return role || "Unknown";
          }
        ]
      }
    },
    {
      name: "name",
      type: "group",
      fields: [
        {
          name: "cs",
          type: "text",
          required: true
        },
        {
          name: "en",
          type: "text",
          required: true
        }
      ]
    },
    {
      name: "role",
      type: "group",
      fields: [
        {
          name: "cs",
          type: "text",
          required: true
        },
        {
          name: "en",
          type: "text",
          required: true
        }
      ]
    },
    {
      name: "bio",
      type: "group",
      fields: [
        {
          name: "cs",
          type: "textarea",
          required: false
        },
        {
          name: "en",
          type: "textarea",
          required: false
        }
      ]
    },
    {
      name: "focus",
      label: "Focus areas",
      type: "array",
      admin: {
        description: "Displayed as expertise badges on the website."
      },
      fields: [
        {
          name: "value",
          label: "Focus item",
          type: "group",
          fields: [
            {
              name: "cs",
              type: "text",
              required: true
            },
            {
              name: "en",
              type: "text",
              required: true
            }
          ]
        }
      ]
    },
    {
      name: "accent",
      label: "Accent gradient",
      type: "text",
      admin: {
        description: "CSS color or gradient used for card glow (e.g. linear-gradient(...)).",
        position: "sidebar"
      }
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
      required: false
    },
    {
      name: "socials",
      label: "Social links",
      type: "group",
      admin: {
        position: "sidebar"
      },
      fields: [
        {
          name: "linkedin",
          type: "text"
        },
        {
          name: "twitter",
          type: "text"
        },
        {
          name: "instagram",
          type: "text"
        },
        {
          name: "youtube",
          type: "text"
        },
        {
          name: "website",
          type: "text"
        }
      ]
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: {
        position: "sidebar"
      }
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar"
      }
    },
    {
      name: "showOnSite",
      label: "Show on website",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar"
      }
    }
  ]
};

// src/payload/collections/Users.ts
var Users = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email"
  },
  fields: [
    {
      name: "name",
      type: "text"
    }
  ]
};

// src/payload/globals/SiteSettings.ts
var SiteSettings = {
  slug: "siteSettings",
  label: "Site Settings",
  access: {
    read: () => true
  },
  fields: [
    {
      name: "social",
      type: "group",
      fields: [
        { name: "instagram", type: "text" },
        { name: "linkedin", type: "text" },
        { name: "twitter", type: "text" }
      ]
    }
  ]
};

// src/payload/env.ts
var logDebug = (...args) => {
  if ((process.env.LOG_LEVEL || "").toLowerCase() === "debug") {
    console.log("[debug]", ...args);
  }
};
var requireEnv = (key) => {
  const value = process.env[key];
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  throw new Error(
    `[payload] Missing required environment variable "${key}". Ensure it is defined in your runtime environment or .env file before starting the app.`
  );
};
var resolveEnvWithFallback = (...keys) => {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  throw new Error(
    `[payload] Missing required environment variable. Tried keys: ${keys.join(", ")}. Set a remote MongoDB connection string (mongodb+srv://...).`
  );
};
var assertNotLocalMongo = (uri) => {
  const isLocal = /^mongodb(?:\+srv)?:\/\/(localhost|127(?:\.0){2}\.1)(?=[:/]|$)/i.test(uri);
  if (isLocal) {
    throw new Error(
      "[payload] Local MongoDB connection strings are not supported. Provide a remote MongoDB cluster URI."
    );
  }
  try {
    const host = uri.replace(/^mongodb(?:\+srv)?:\/\/[^@]*@/, "mongodb+srv://").split("/")[2] || "unknown-host";
    logDebug("[env] using remote MongoDB host", host);
  } catch {
  }
  return uri;
};
var resolvePayloadSecret = () => requireEnv("PAYLOAD_SECRET");
var resolveDatabaseUri = () => assertNotLocalMongo(resolveEnvWithFallback("DATABASE_URI", "MONGODB_URI"));

// src/payload/config.ts
var defaultFromAddress = process.env.SMTP_FROM ?? (process.env.SMTP_USER ? `${process.env.SMTP_USER}` : "info@expandmatrix.com");
var defaultFromName = process.env.SMTP_FROM_NAME ?? "Expand Matrix";
var smtpHost = process.env.SMTP_HOST ?? "smtp.gmail.com";
var smtpPort = Number(process.env.SMTP_PORT ?? 465);
var smtpSecure = (process.env.SMTP_SECURE ?? "true") !== "false";
var smtpUser = process.env.SMTP_USER;
var smtpPass = process.env.SMTP_PASS;
var transporter = smtpUser && smtpPass ? import_nodemailer.default.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: smtpUser,
    pass: smtpPass
  }
}) : null;
var secret = resolvePayloadSecret();
var databaseUri = resolveDatabaseUri();
var enableAutoLogin = process.env.PAYLOAD_AUTOLOGIN === "true";
var autoLoginEmail = process.env.PAYLOAD_ADMIN_EMAIL;
var autoLoginPassword = process.env.PAYLOAD_ADMIN_PASSWORD;
var payloadConfig = (0, import_payload.buildConfig)({
  secret,
  admin: {
    user: "users",
    ...enableAutoLogin && autoLoginEmail && autoLoginPassword ? {
      autoLogin: {
        email: autoLoginEmail,
        password: autoLoginPassword,
        prefillOnly: true
      }
    } : {}
  },
  routes: {
    admin: "/admin"
  },
  editor: (0, import_richtext_lexical.lexicalEditor)({}),
  sharp: import_sharp.default,
  localization: {
    locales: [
      {
        label: "English",
        code: "en"
      },
      {
        label: "Czech",
        code: "cs"
      }
    ],
    defaultLocale: "en",
    fallback: true
  },
  collections: [Users, Team, Partners, References, FAQ, Media, FooterLinks, Subscribers],
  globals: [SiteSettings],
  typescript: {
    outputFile: import_path.default.resolve(process.cwd(), "payload-types.ts")
  },
  graphQL: {
    schemaOutputFile: import_path.default.resolve(process.cwd(), "generated-schema.graphql")
  },
  email: ({ payload }) => transporter ? {
    name: "gmail-smtp",
    defaultFromAddress,
    defaultFromName,
    sendEmail: async (message) => {
      const { from, ...rest } = message;
      return transporter.sendMail({
        ...rest,
        from: from ?? `${defaultFromName} <${defaultFromAddress}>`
      });
    }
  } : {
    name: "console",
    defaultFromAddress,
    defaultFromName,
    sendEmail: async (message) => {
      const { subject } = message;
      payload.logger.warn(
        `SMTP credentials missing, email not sent. Subject: ${subject ?? "(no subject)"}`
      );
      return Promise.resolve();
    }
  },
  plugins: [],
  db: (0, import_db_mongodb.mongooseAdapter)({
    url: databaseUri
  })
});
var config_default = payloadConfig;

// payload.config.ts
var payload_config_default = config_default;
