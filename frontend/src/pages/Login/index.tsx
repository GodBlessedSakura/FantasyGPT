import { useState } from 'react';
import { Form, Input, Button } from 'antd';
import request from '@/utils/request';
import styles from './index.less';

export default function Login() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    // TODO: 处理登录逻辑
    const { email, password } = values;
    const response = await request.post('/user/login', {
      data: {
        email,
        password,
      },
    });
    if (response) {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles['form-wrapper']}>
        <h3 className={styles.title}>FantasyGPT</h3>
        <Form onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Please enter a valid email address',
              },
            ]}
          >
            <Input placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder="Password" size="large" />
          </Form.Item>
          <div className={styles['btn-wrapper']}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
            >
              Sign In
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
