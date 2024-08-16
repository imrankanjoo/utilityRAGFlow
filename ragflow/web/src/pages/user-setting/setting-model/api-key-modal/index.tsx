import { IModalManagerChildrenProps } from '@/components/modal-manager';
import { useTranslate } from '@/hooks/common-hooks';
import { Form, Input, Modal } from 'antd';
import { useEffect } from 'react';
import { ApiKeyPostBody } from '../../interface';

interface IProps extends Omit<IModalManagerChildrenProps, 'showModal'> {
  loading: boolean;
  initialValue: string;
  llmFactory: string;
  onOk: (postBody: ApiKeyPostBody) => void;
  showModal?(): void;
}

type FieldType = {
  api_key?: string;
  base_url?: string;
  group_id?: string;
};

const modelsWithBaseUrl = ['OpenAI', 'Azure-OpenAI','UtilityAI'];

const ApiKeyModal = ({
  visible,
  hideModal,
  llmFactory,
  loading,
  initialValue,
  onOk,
}: IProps) => {
  const [form] = Form.useForm();
  const { t } = useTranslate('setting');

  const handleOk = async () => {
    const ret = await form.validateFields();

    return onOk(ret);
  };

  useEffect(() => {
    console.log('llmFactory:', llmFactory); // Add this to debug

    if (visible) {
      form.setFieldsValue({
        api_key: initialValue,
        base_url: llmFactory === 'UtilityAI' ? 'https://api.dify.ai/v1' : 'https://api.openai.com/v1',
      });
        }
  }, [initialValue, form, visible]);

  return (
    <Modal
      title={t('modify')}
      open={visible}
      onOk={handleOk}
      onCancel={hideModal}
      okButtonProps={{ loading }}
      confirmLoading={loading}
    >
      <Form
        name="basic"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ maxWidth: 600 }}
        autoComplete="off"
        form={form}
      >
        <Form.Item<FieldType>
          label={t('apiKey')}
          name="api_key"
          tooltip={t('apiKeyTip')}
          rules={[{ required: true, message: t('apiKeyMessage') }]}
        >
          <Input />
        </Form.Item>
        {modelsWithBaseUrl.some((x) => x === llmFactory) && (
          <Form.Item<FieldType>
            label={t('baseUrl')}
            name="base_url"
            tooltip={t('baseUrlTip')}
          >
            <Input placeholder={llmFactory === 'UtilityAI' ? 'https://api.dify.ai/v1' : 'https://api.openai.com/v1'} />
            </Form.Item>
        )}
        {llmFactory?.toLowerCase() === 'Minimax'.toLowerCase() && (
          <Form.Item<FieldType> label={'Group ID'} name="group_id">
            <Input />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default ApiKeyModal;
