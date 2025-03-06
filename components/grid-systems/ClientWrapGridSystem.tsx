'use client';

import { useEffect, useState } from 'react';
import LoadingPage from './loadingPage';
import _ from 'lodash';
import GridSystemContainer from '@/components/grid-systems';
import { getDeviceType } from '@/lib/utils';
import { usePreviewUI } from '@/app/actions/use-constructor';
import { useSearchParams } from 'next/navigation';

import SandPackUI from './previewUI';

export default function ClientWrapper(props: any) {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');

  const [deviceType, setDeviceType] = useState(getDeviceType());
  const { dataPreviewUI, isLoading } = usePreviewUI(projectId ?? '');
  const isComponent = _.get(dataPreviewUI, 'data.typePreview') === 'page';
  const layout = _.get(dataPreviewUI, 'data.previewData');

  useEffect(() => {
    const handleResize = () => setDeviceType(getDeviceType());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="component-preview-container">
      {isComponent ? (
        <GridSystemContainer
          isLoading={isLoading}
          {...props}
          page={layout[deviceType] || {}}
          deviceType={deviceType}
        />
      ) : (
        <SandPackUI dataPreviewUI={dataPreviewUI} />
      )}
    </div>
  );
}
