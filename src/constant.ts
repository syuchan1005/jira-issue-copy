import { v4 as uuidv4 } from 'uuid';
import { browser } from 'webextension-polyfill-ts';

export const parentContextMenuId = 'jira-issue-copy';

type FormType = {
  // @ts-ignore
  types: string[];
  // @ts-ignore
  titles: { [key: string]: string };
  [key: string]: Array<{
    name: string,
    value: string,
    action: (data: IssueData) => string,
  }>;
}
// @ts-ignore
export const formType: FormType = {
  types: [
    'numberFormat',
    'dividerFormat',
    'titleFormat',
  ],
  titles: {
    numberFormat: 'Number Format',
    dividerFormat: 'Divider Format',
    titleFormat: 'Title Format',
  },
  numberFormat: [
    {
      name: 'Noop',
      value: 'NOOP',
      action: (s) => (s?.num || ''),
    },
    {
      name: 'None',
      value: 'NONE',
      action: () => '',
    },
    {
      name: 'Uppercase',
      value: 'UPPER',
      action: (s) => (s?.num || '').toUpperCase(),
    },
    {
      name: 'Lowercase',
      value: 'LOWER',
      action: (s) => (s?.num || '').toLowerCase(),
    },
  ],
  dividerFormat: [
    {
      name: 'Empty',
      value: 'EMPTY',
      action: () => '',
    },
    {
      name: 'Dash (-)',
      value: 'DASH',
      action: () => '-',
    },
    {
      name: 'Underscore (_)',
      value: 'UNDERSCORE',
      action: () => '_',
    },
    {
      name: 'Space',
      value: 'SPACE',
      action: () => ' ',
    },
  ],
  titleFormat: [
    {
      name: 'Noop',
      value: 'NOOP',
      action: (s) => (s?.title || ''),
    },
    {
      name: 'None',
      value: 'NONE',
      action: () => '',
    },
    {
      name: 'Underscore (_)',
      value: 'UNDERSCORE',
      action: (s) => (s?.title || '').replace(/ /g, '_'),
    },
  ],
};

export type IssueData = {
  num: string,
  title: string,
};

export const defaultIssueData = (): IssueData => ({ num: '', title: '' });

export type Preset = {
  open: boolean,
  id: string,
  name: string,
  format: {
    [key: string]: string,
  },
};

export const defaultPreset = (): Preset => ({
  open: false,
  id: uuidv4(),
  name: 'Preset',
  format: {
    numberFormat: formType.numberFormat[0].value,
    dividerFormat: formType.dividerFormat[0].value,
    titleFormat: formType.titleFormat[0].value,
  },
});

export const applyFormat = (
  format: Preset['format'],
  issueData: IssueData,
) => formType.types.reduce((str, type) => {
  const edited = (formType[type].find(({ value }) => value === format[type])
    || formType[type][0]).action(issueData);
  return `${str}${edited}`;
}, '');

export const resetContextMenus = async () => {
  // @ts-ignore
  const { presets }: { presets: Array<Preset> | undefined } = await browser.storage.local.get('presets');

  await Promise.all(
    [parentContextMenuId, ...presets.map((p) => p.id)]
      .map((id) => browser.contextMenus.remove(id)),
  ).catch(() => { /* ignored */ });

  browser.contextMenus.create({
    title: 'Jira Issue Copy',
    id: parentContextMenuId,
    type: 'normal',
    contexts: ['all'],
  });

  (presets || []).forEach((preset) => {
    browser.contextMenus.create({
      title: preset.name,
      parentId: parentContextMenuId,
      id: preset.id,
      type: 'normal',
      contexts: ['all'],
    });
  });
};
