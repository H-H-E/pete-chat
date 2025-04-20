import { BrandLoading, LobeHubText } from '@lobehub/ui/brand';
import { Center, Flexbox } from 'react-layout-kit';

import { BRANDING_NAME } from '@/const/branding';
import { isCustomBranding } from '@/const/version';


export default () => {
  if (isCustomBranding) {
    return (
      <Center height={'100%'} width={'100%'}>
        <Flexbox style={{ fontSize: 24, fontWeight: 'bold', opacity: 0.8 }}>
          {BRANDING_NAME}
        </Flexbox>
      </Center>
    );
  }

  return (
    <Center height={'100%'} width={'100%'}>
      <BrandLoading size={40} style={{ opacity: 0.6 }} text={LobeHubText} />
    </Center>
  );
};
