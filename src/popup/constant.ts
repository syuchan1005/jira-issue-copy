export type IssueData = {
  num: string,
  title: string,
};

export const defaultIssueData = (): IssueData => ({ num: '', title: '' });

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
      action: (s) => s.num,
    },
    {
      name: 'None',
      value: 'NONE',
      action: () => '',
    },
    {
      name: 'Uppercase',
      value: 'UPPER',
      action: (s) => s.num.toUpperCase(),
    },
    {
      name: 'Lowercase',
      value: 'LOWER',
      action: (s) => s.num.toLowerCase(),
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
      action: (s) => s.title,
    },
    {
      name: 'None',
      value: 'NONE',
      action: () => '',
    },
    {
      name: 'Underscore (_)',
      value: 'UNDERSCORE',
      action: (s) => s.title.replace(/ /g, '_'),
    },
  ],
};

export type Preset = {
  name: string,
  format: {
    [key: string]: number | string,
  },
};

export const defaultPreset = (): Preset => ({
  name: 'Preset',
  format: {
    numberFormat: formType.numberFormat[0].value,
    dividerFormat: formType.dividerFormat[0].value,
    titleFormat: formType.titleFormat[0].value,
  },
});
