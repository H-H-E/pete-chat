import { Logo, MobileNavBar } from '@lobehub/ui';
import { memo } from 'react';

const Header = memo(() => {
  return <MobileNavBar center={<Logo extra={'PoiesisPete'} type={'high-contrast'} />} />;
});

export default Header;
