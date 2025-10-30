'use client';

import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button, Collapsible, Drawer, EditDepthProvider, ErrorPill, Form, formatDrawerSlug, FormSubmit, Pill, RenderFields, SectionTitle, useConfig, useDocumentForm, useDocumentInfo, useEditDepth, useFormSubmitted, useServerFunctions, useTranslation } from '@payloadcms/ui';
import { abortAndIgnore } from '@payloadcms/ui/shared';
import { deepCopyObjectSimpleWithoutReactComponents, reduceFieldsToValues } from 'payload/shared';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
const baseClass = 'lexical-block';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { getTranslation } from '@payloadcms/translations';
import { $getNodeByKey } from 'lexical';
import { v4 as uuid } from 'uuid';
import { useEditorConfigContext } from '../../../../lexical/config/client/EditorConfigProvider.js';
import { useLexicalDrawer } from '../../../../utilities/fieldsDrawer/useLexicalDrawer.js';
import { $isBlockNode } from '../nodes/BlocksNode.js';
import { BlockContent } from './BlockContent.js';
import { removeEmptyArrayValues } from './removeEmptyArrayValues.js';
export const BlockComponent = props => {
  const {
    cacheBuster,
    formData,
    nodeKey
  } = props;
  const submitted = useFormSubmitted();
  const {
    id,
    collectionSlug,
    globalSlug
  } = useDocumentInfo();
  const {
    fieldProps: {
      featureClientSchemaMap,
      field: parentLexicalRichTextField,
      initialLexicalFormState,
      permissions,
      readOnly,
      schemaPath
    },
    uuid: uuidFromContext
  } = useEditorConfigContext();
  const {
    fields: parentDocumentFields
  } = useDocumentForm();
  const onChangeAbortControllerRef = useRef(new AbortController());
  const editDepth = useEditDepth();
  const [errorCount, setErrorCount] = React.useState(0);
  const {
    config
  } = useConfig();
  const drawerSlug = formatDrawerSlug({
    slug: `lexical-blocks-create-${uuidFromContext}-${formData.id}`,
    depth: editDepth
  });
  const {
    toggleDrawer
  } = useLexicalDrawer(drawerSlug);
  // Used for saving collapsed to preferences (and gettin' it from there again)
  // Remember, these preferences are scoped to the whole document, not just this form. This
  // is important to consider for the data path used in setDocFieldPreferences
  const {
    getDocPreferences,
    setDocFieldPreferences
  } = useDocumentInfo();
  const [editor] = useLexicalComposerContext();
  const {
    getFormState
  } = useServerFunctions();
  const schemaFieldsPath = `${schemaPath}.lexical_internal_feature.blocks.lexical_blocks.${formData.blockType}.fields`;
  const [initialState, setInitialState] = React.useState(() => {
    return initialLexicalFormState?.[formData.id]?.formState ? {
      ...initialLexicalFormState?.[formData.id]?.formState,
      blockName: {
        initialValue: formData.blockName,
        passesCondition: true,
        valid: true,
        value: formData.blockName
      }
    } : false;
  });
  const hasMounted = useRef(false);
  const prevCacheBuster = useRef(cacheBuster);
  useEffect(() => {
    if (hasMounted.current) {
      if (prevCacheBuster.current !== cacheBuster) {
        setInitialState(false);
      }
      prevCacheBuster.current = cacheBuster;
    } else {
      hasMounted.current = true;
    }
  }, [cacheBuster]);
  const [CustomLabel, setCustomLabel] = React.useState(
  // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
  initialState?.['_components']?.customComponents?.BlockLabel);
  const [CustomBlock, setCustomBlock] = React.useState(
  // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
  initialState?.['_components']?.customComponents?.Block);
  // Initial state for newly created blocks
  useEffect(() => {
    const abortController = new AbortController();
    const awaitInitialState = async () => {
      /*
      * This will only run if a new block is created. For all existing blocks that are loaded when the document is loaded, or when the form is saved,
      * this is not run, as the lexical field RSC will fetch the state server-side and pass it to the client. That way, we avoid unnecessary client-side
      * requests. Though for newly created blocks, we need to fetch the state client-side, as the server doesn't know about the block yet.
      */
      const {
        state
      } = await getFormState({
        id,
        collectionSlug,
        data: formData,
        docPermissions: {
          fields: true
        },
        docPreferences: await getDocPreferences(),
        documentFormState: deepCopyObjectSimpleWithoutReactComponents(parentDocumentFields),
        globalSlug,
        initialBlockData: formData,
        operation: 'update',
        renderAllFields: true,
        schemaPath: schemaFieldsPath,
        signal: abortController.signal
      });
      if (state) {
        state.blockName = {
          initialValue: formData.blockName,
          passesCondition: true,
          valid: true,
          value: formData.blockName
        };
        const newFormStateData = reduceFieldsToValues(deepCopyObjectSimpleWithoutReactComponents(state), true);
        // Things like default values may come back from the server => update the node with the new data
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if (node && $isBlockNode(node)) {
            const newData = newFormStateData;
            newData.blockType = formData.blockType;
            node.setFields(newData, true);
          }
        });
        setInitialState(state);
        setCustomLabel(state._components?.customComponents?.BlockLabel);
        setCustomBlock(state._components?.customComponents?.Block);
      }
    };
    if (formData && !initialState) {
      void awaitInitialState();
    }
    return () => {
      abortAndIgnore(abortController);
    };
  }, [getFormState, schemaFieldsPath, id, formData, editor, nodeKey, initialState, collectionSlug, globalSlug, getDocPreferences, parentDocumentFields]);
  const [isCollapsed, setIsCollapsed] = React.useState(initialLexicalFormState?.[formData.id]?.collapsed ?? false);
  const componentMapRenderedBlockPath = `${schemaPath}.lexical_internal_feature.blocks.lexical_blocks.${formData.blockType}`;
  const clientSchemaMap = featureClientSchemaMap['blocks'];
  const blocksField = clientSchemaMap?.[componentMapRenderedBlockPath]?.[0];
  const clientBlock = blocksField.blockReferences ? typeof blocksField?.blockReferences?.[0] === 'string' ? config.blocksMap[blocksField?.blockReferences?.[0]] : blocksField?.blockReferences?.[0] : blocksField?.blocks?.[0];
  const {
    i18n,
    t
  } = useTranslation();
  const onChange = useCallback(async ({
    formState: prevFormState,
    submit
  }) => {
    abortAndIgnore(onChangeAbortControllerRef.current);
    const controller = new AbortController();
    onChangeAbortControllerRef.current = controller;
    const {
      state: newFormState
    } = await getFormState({
      id,
      collectionSlug,
      docPermissions: {
        fields: true
      },
      docPreferences: await getDocPreferences(),
      documentFormState: deepCopyObjectSimpleWithoutReactComponents(parentDocumentFields),
      formState: prevFormState,
      globalSlug,
      initialBlockFormState: prevFormState,
      operation: 'update',
      renderAllFields: submit ? true : false,
      schemaPath: schemaFieldsPath,
      signal: controller.signal
    });
    if (!newFormState) {
      return prevFormState;
    }
    if (prevFormState.blockName) {
      newFormState.blockName = prevFormState.blockName;
    }
    const newFormStateData_0 = reduceFieldsToValues(removeEmptyArrayValues({
      fields: deepCopyObjectSimpleWithoutReactComponents(newFormState)
    }), true);
    setTimeout(() => {
      editor.update(() => {
        const node_0 = $getNodeByKey(nodeKey);
        if (node_0 && $isBlockNode(node_0)) {
          const newData_0 = newFormStateData_0;
          newData_0.blockType = formData.blockType;
          node_0.setFields(newData_0, true);
        }
      });
    }, 0);
    if (submit) {
      setCustomLabel(newFormState._components?.customComponents?.BlockLabel);
      setCustomBlock(newFormState._components?.customComponents?.Block);
      let rowErrorCount = 0;
      for (const formField of Object.values(newFormState)) {
        if (formField?.valid === false) {
          rowErrorCount++;
        }
      }
      setErrorCount(rowErrorCount);
    }
    return newFormState;
  }, [getFormState, id, collectionSlug, getDocPreferences, globalSlug, schemaFieldsPath, formData.blockType, parentDocumentFields, editor, nodeKey]);
  useEffect(() => {
    return () => {
      abortAndIgnore(onChangeAbortControllerRef.current);
    };
  }, []);
  const removeBlock = useCallback(() => {
    editor.update(() => {
      $getNodeByKey(nodeKey)?.remove();
    });
  }, [editor, nodeKey]);
  const blockDisplayName = clientBlock?.labels?.singular ? getTranslation(clientBlock.labels.singular, i18n) : clientBlock?.slug;
  const onCollapsedChange = useCallback(changedCollapsed => {
    void getDocPreferences().then(currentDocPreferences => {
      const currentFieldPreferences = currentDocPreferences?.fields?.[parentLexicalRichTextField.name];
      const collapsedArray = currentFieldPreferences?.collapsed;
      const newCollapsed = collapsedArray && collapsedArray?.length ? collapsedArray : [];
      if (changedCollapsed) {
        if (!newCollapsed.includes(formData.id)) {
          newCollapsed.push(formData.id);
        }
      } else {
        if (newCollapsed.includes(formData.id)) {
          newCollapsed.splice(newCollapsed.indexOf(formData.id), 1);
        }
      }
      setDocFieldPreferences(parentLexicalRichTextField.name, {
        collapsed: newCollapsed,
        hello: 'hi'
      });
    });
  }, [getDocPreferences, parentLexicalRichTextField.name, setDocFieldPreferences, formData.id]);
  const EditButton = useMemo(() => () => /*#__PURE__*/_jsx(Button, {
    buttonStyle: "icon-label",
    className: `${baseClass}__editButton`,
    disabled: readOnly,
    el: "button",
    icon: "edit",
    onClick: e => {
      e.preventDefault();
      e.stopPropagation();
      toggleDrawer();
      return false;
    },
    onMouseDown: e_0 => {
      // Needed to preserve lexical selection for toggleDrawer lexical selection restore.
      // I believe this is needed due to this button (usually) being inside of a collapsible.
      e_0.preventDefault();
    },
    round: true,
    size: "small",
    tooltip: t('lexical:blocks:inlineBlocks:edit', {
      label: blockDisplayName
    })
  }), [blockDisplayName, readOnly, t, toggleDrawer]);
  const RemoveButton = useMemo(() => () => /*#__PURE__*/_jsx(Button, {
    buttonStyle: "icon-label",
    className: `${baseClass}__removeButton`,
    disabled: parentLexicalRichTextField?.admin?.readOnly || false,
    icon: "x",
    onClick: e_1 => {
      e_1.preventDefault();
      removeBlock();
    },
    round: true,
    tooltip: "Remove Block"
  }), [parentLexicalRichTextField?.admin?.readOnly, removeBlock]);
  const BlockCollapsible = useMemo(() => ({
    children,
    disableBlockName,
    editButton,
    errorCount: errorCount_0,
    fieldHasErrors,
    Label,
    removeButton
  }) => /*#__PURE__*/_jsx("div", {
    className: baseClass + ' ' + baseClass + '-' + formData.blockType,
    children: /*#__PURE__*/_jsx(Collapsible, {
      className: [`${baseClass}__row`, fieldHasErrors ? `${baseClass}__row--has-errors` : `${baseClass}__row--no-errors`].join(' '),
      collapsibleStyle: fieldHasErrors ? 'error' : 'default',
      header: /*#__PURE__*/_jsxs("div", {
        className: `${baseClass}__block-header`,
        children: [Label ?? CustomLabel ? Label ?? CustomLabel : /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx(Pill, {
            className: `${baseClass}__block-pill ${baseClass}__block-pill-${formData?.blockType}`,
            pillStyle: "white",
            size: "small",
            children: blockDisplayName ?? formData?.blockType
          }), !disableBlockName && !clientBlock?.admin?.disableBlockName && /*#__PURE__*/_jsx(SectionTitle, {
            path: "blockName",
            readOnly: parentLexicalRichTextField?.admin?.readOnly || false
          }), fieldHasErrors && /*#__PURE__*/_jsx(ErrorPill, {
            count: errorCount_0 ?? 0,
            i18n: i18n,
            withMessage: true
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [CustomBlock && editButton !== false || !CustomBlock && editButton ? /*#__PURE__*/_jsx(EditButton, {}) : null, removeButton !== false && editor.isEditable() ? /*#__PURE__*/_jsx(RemoveButton, {}) : null]
        })]
      }),
      isCollapsed: isCollapsed,
      onToggle: incomingCollapsedState => {
        onCollapsedChange(incomingCollapsedState);
        setIsCollapsed(incomingCollapsedState);
      },
      children: children
    }, 0)
  }), [CustomBlock, CustomLabel, EditButton, RemoveButton, blockDisplayName, clientBlock?.admin?.disableBlockName, editor, formData.blockType, i18n, isCollapsed, onCollapsedChange, parentLexicalRichTextField?.admin?.readOnly]);
  const BlockDrawer = useMemo(() => () => /*#__PURE__*/_jsx(EditDepthProvider, {
    children: /*#__PURE__*/_jsx(Drawer, {
      className: '',
      slug: drawerSlug,
      title: t(`lexical:blocks:inlineBlocks:${formData?.id ? 'edit' : 'create'}`, {
        label: blockDisplayName ?? t('lexical:blocks:inlineBlocks:label')
      }),
      children: initialState ? /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsx(RenderFields, {
          fields: clientBlock?.fields ?? [],
          forceRender: true,
          parentIndexPath: "",
          parentPath: "" // See Blocks feature path for details as for why this is empty
          ,

          parentSchemaPath: schemaFieldsPath,
          permissions: true,
          readOnly: false
        }), /*#__PURE__*/_jsx(FormSubmit, {
          programmaticSubmit: true,
          children: t('fields:saveChanges')
        })]
      }) : null
    })
  }), [initialState, drawerSlug, blockDisplayName, t, clientBlock?.fields, schemaFieldsPath, permissions]);
  // Memoized Form JSX
  const Block = useMemo(() => {
    if (!initialState) {
      return null;
    }
    return /*#__PURE__*/_jsx(Form, {
      beforeSubmit: [async ({
        formState
      }) => {
        // This is only called when form is submitted from drawer - usually only the case if the block has a custom Block component
        return await onChange({
          formState,
          submit: true
        });
      }],
      el: "div",
      fields: clientBlock?.fields ?? [],
      initialState: initialState,
      onChange: [onChange],
      onSubmit: (formState_0, newData_1) => {
        // This is only called when form is submitted from drawer - usually only the case if the block has a custom Block component
        newData_1.blockType = formData.blockType;
        editor.update(() => {
          const node_1 = $getNodeByKey(nodeKey);
          if (node_1 && $isBlockNode(node_1)) {
            node_1.setFields(newData_1, true);
          }
        });
        toggleDrawer();
      },
      submitted: submitted,
      uuid: uuid(),
      children: /*#__PURE__*/_jsx(BlockContent, {
        baseClass: baseClass,
        BlockDrawer: BlockDrawer,
        Collapsible: BlockCollapsible,
        CustomBlock: CustomBlock,
        EditButton: EditButton,
        errorCount: errorCount,
        formSchema: clientBlock?.fields ?? [],
        initialState: initialState,
        nodeKey: nodeKey,
        RemoveButton: RemoveButton
      })
    });
  }, [BlockCollapsible, BlockDrawer, CustomBlock, clientBlock?.fields, RemoveButton, EditButton, editor, errorCount, toggleDrawer, clientBlock?.fields,
  // DO NOT ADD FORMDATA HERE! Adding formData will kick you out of sub block editors while writing.
  initialState, nodeKey, onChange, submitted]);
  if (!clientBlock) {
    return /*#__PURE__*/_jsx(BlockCollapsible, {
      disableBlockName: true,
      fieldHasErrors: true,
      children: /*#__PURE__*/_jsxs("div", {
        className: "lexical-block-not-found",
        children: ["Error: Block '", formData.blockType, "' not found in the config but exists in the lexical data"]
      })
    });
  }
  return Block;
};
//# sourceMappingURL=index.js.map