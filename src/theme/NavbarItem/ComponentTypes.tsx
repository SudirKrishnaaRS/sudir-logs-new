import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import FocusToggleNavbarItem from '@site/src/components/FocusMode/NavbarItem';

// Adds custom navbar item types, used from docusaurus.config.ts.
export default {
  ...ComponentTypes,
  'custom-focusToggle': FocusToggleNavbarItem,
};
