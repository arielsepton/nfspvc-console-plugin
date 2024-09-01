import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Page, PageSection, Title, Form, ActionGroup, Button, FormGroup,
    TextInput, Divider, FormSelect, FormSelectOption } from '@patternfly/react-core';
import { useHistory } from 'react-router-dom';
import { k8sCreate, K8sModel, NamespaceBar} from '@openshift-console/dynamic-plugin-sdk';
import './example.css';

// Define the K8sModel for PersistentVolumeClaim
const nfsPvcModel: K8sModel = {
    apiVersion: 'v1',
    kind: 'PersistentVolumeClaim',
    label: 'Persistent Volume Claim',
    labelPlural: 'Persistent Volume Claims',
    abbr: 'PVC',
    plural: 'persistentvolumeclaims',
};

export default function CreateNfsPvc() {
    const { t } = useTranslation('plugin__console-plugin-template');
    const [name, setName] = React.useState('');
    const [path, setPath] = React.useState('/volume/my_volume');
    const [capacity, setCapacity] = React.useState('');
    const [accessMode, setAccessMode] = React.useState('default');
    const [server, setServer] = React.useState('vs-nas-omer');
    const history = useHistory();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newPvc = {
            apiVersion: 'v1',
            kind: 'PersistentVolumeClaim',
            metadata: {
                name,
                "namespace": "namespace", // TODO: take from sidebar
            },
            spec: {
                accessModes: ['ReadWriteOnce'],
                resources: {
                    requests: {
                        storage: path,
                    },
                },
                storageClassName: capacity,
            }
        };

        try {
            await k8sCreate({
                model: nfsPvcModel,
                data: newPvc,
            });
            history.push('/nfspvcs');
        } catch (error) {
            console.error('Error creating PVC:', error);
            alert('Failed to create PVC.');
        }
    };

    // TODO: modify options values
    const options = [
        { value: 'ReadWriteMany', label: 'ReadWriteMany' },
        { value: 'ReadWriteOnce', label: 'ReadWriteOnce' },
        { value: 'ReadOnlyMany', label: 'ReadOnlyMany' },
    ];

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPath(event.target.value);
    };

    const handleStorageClassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCapacity(event.target.value);
    };

    const handleAccessModeChange = (_event: React.FormEvent<HTMLSelectElement>, value: string) => {
        setAccessMode(value);
    };

    const handleServerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setServer(event.target.value);
    };

    return (
        <>
            <Page>
                <NamespaceBar></NamespaceBar>
                <PageSection variant="light">
                    <Form onSubmit={handleSubmit}>
                        <Title headingLevel="h1">{t('Create NFS PVC')}</Title>
                        <Title headingLevel="h5">{t('PVC Name')}</Title>
                        <FormGroup label={t('Name')} isRequired fieldId="name" className="input">
                            <TextInput
                                value={name}
                                id="name"
                                isRequired
                                type="text"
                                onChange={handleNameChange}
                            />
                        </FormGroup>
                        <Divider />
                        <Title headingLevel="h5">{t('NFS Details')}</Title>
                        <div className={"container"}>
                            <FormGroup label={t('Path')} isRequired fieldId="path" className="pb-1">
                             <TextInput
                                 value={path}
                                 id="path"
                                 isRequired
                                 type="text"
                                 onChange={handleSizeChange}
                             />
                             </FormGroup>
                             <FormGroup label={t('Capacity')} fieldId="capacity" className="pb-1">
                                 <TextInput
                                     value={capacity}
                                     id="capacity"
                                     type="text"
                                     onChange={handleStorageClassChange}
                                 />
                             </FormGroup>
                             <FormGroup label={t('AccessMode')} isRequired fieldId="access-mode" className="pb-1">
                                 <FormSelect value={accessMode}
                                             onChange={handleAccessModeChange}
                                             aria-label="FormSelect Input"
                                             id="access-mode"
                                             isRequired
                                             className="w-6"
                                 >
                                     {options.map((option, index) => (
                                         <FormSelectOption key={index} value={option.value} label={option.label} />
                                     ))}
                                 </FormSelect>
                             </FormGroup>
                            <FormGroup label={t('Server')} isRequired fieldId="server" className="pb-1">
                                <TextInput
                                    value={server}
                                    id="server"
                                    isRequired
                                    type="text"
                                    onChange={handleServerChange}
                                />
                            </FormGroup>
                        </div>
                        <ActionGroup>
                            <Button type="submit" variant="primary">{t('Create')}</Button>
                        </ActionGroup>
                    </Form>
                </PageSection>
            </Page>
        </>
    );
};
