import { Dispatch, SetStateAction, useState } from 'react';
import { Form, Input, Spin } from 'antd';
import request from '@/utils/request';
import MyIcon from '@/components/Icons';
import styles from './index.less';
const { TextArea } = Input;
export default function ChatBox(props: chatBoxProps) {
  const [form] = Form.useForm();
  const [isProcessing, setProcessing] = useState<boolean>(false);

  const { id, onSendConversation } = props;
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (isProcessing) return;
    const values = await form.validateFields();
    setProcessing(true);
    const { text } = values;
    const response = await request.post('/conversation/generate', {
      data: {
        topicId: id,
        role: 'user',
        text,
      },
    });
    if (response) {
      form.setFieldValue('text', '');
      setProcessing(false);
      onSendConversation(id);
    }
  };

  return (
    <div className={styles.chatbox}>
      <Form style={{ width: '60%' }} form={form}>
        <div style={{ position: 'relative', padding: '0 8px 8px 8px' }}>
          <Form.Item
            style={{ marginBottom: '0px' }}
            name="text"
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Message cannot be empty',
              },
            ]}
          >
            <TextArea
              autoSize={{ minRows: 1, maxRows: 4 }}
              style={{
                resize: 'none',
                padding: '8px',
                height: '40px',
                maxHeight: '200px',
              }}
              onPressEnter={handleSendMessage}
            />
          </Form.Item>
          {isProcessing ? (
            <Spin
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '20px',
                fontSize: '2rem',
              }}
              spinning={isProcessing}
            />
          ) : (
            <MyIcon
              style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                fontSize: '2rem',
              }}
              type="icon-send"
              onClick={handleSendMessage}
            />
          )}
        </div>
      </Form>
    </div>
  );
}

interface chatBoxProps {
  id: string | undefined;
  onSendConversation(id: string | undefined): void;
}
