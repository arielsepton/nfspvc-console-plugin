import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Page, PageSection, Title, Button, Card, CardBody, CardTitle } from '@patternfly/react-core';
import { useHistory } from 'react-router-dom';

export default function NfsPvcPage() {
    const { t } = useTranslation('plugin__console-plugin-template');
    const history = useHistory();

    const handleCreateClick = () => {
        history.push('/nfspvcs/create');
    };

    return (
        <Page>
            <PageSection>
                <Title headingLevel="h1">{t('NFS PVCs')}</Title>
                <Button variant="primary" onClick={handleCreateClick}>
                    {t('Create NFS PVC')}
                </Button>
                <PageSection>
                    {/* Display NFS PVCs here */}
                    <Card>
                        <CardTitle>{t('NFS PVC List')}</CardTitle>
                        <CardBody>{t('List of NFS PVCs will be displayed here.')}</CardBody>
                    </Card>
                </PageSection>
            </PageSection>
        </Page>
    );
};
