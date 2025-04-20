import { PropsWithChildren } from 'react';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <html dir="ltr" lang="en-US">
      <body>{children}</body>
    </html>
  );
};

export default Layout;
