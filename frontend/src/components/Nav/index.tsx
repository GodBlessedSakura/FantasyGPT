import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Menu, Space, Input } from 'antd';
import styles from './index.less';
import type { MenuProps } from 'antd';
import { useEffect, useState } from 'react';
import MyIcon from '@/components/Icons';
import request from '@/utils/request';
import { clearTokens } from '@/utils/token';
import { history, useParams } from 'umi';

type MenuItem = Required<MenuProps>['items'][number];

export default function Nav(props: navProps) {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [topics, setTopics] = useState<Topic[]>([]);
  const getSelectedKey = () => {
    const { id } = useParams();

    return id;
  };
  const [selectedKey, setSelectedKey] = useState<string | undefined>(
    getSelectedKey(),
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const getUserInfo = async () => {
    const response = await request.get('/user/get');
    if (response) {
      setTopics(response?.user?.topics);
    }
  };
  const handleLogOut = () => {
    clearTokens();
    history.push('/login');
  };
  const handleAddTopic = async () => {
    const response = await request.post('/topic/create');
    if (response) {
      getUserInfo();
    }
  };
  const handleEditTopic = async (id: string) => {
    if (!value?.trim()) return;
    const response = await request.post('/topic/edit', {
      data: {
        id,
        newName: value,
      },
    });
    if (response) {
      getUserInfo();
      setIsEditing(false);
    }
  };
  const handleDeleteTopic = async (id: string) => {
    const response = await request.post('/topic/delete', {
      data: {
        id,
      },
    });
    if (response) {
      if (selectedKey === id) {
        history.push('/chat');
      }
      getUserInfo();
    }
  };
  const handleSelect = (e: { key: string }) => {
    setSelectedKey(e.key);
    setIsEditing(false);
  };
  useEffect(() => {
    getUserInfo();
  }, []);
  useEffect(() => {
    if (selectedKey) {
      history.push(`/chat/${selectedKey}`);
    }
  }, [selectedKey]);

  const contentLists = topics.map((data) => (
    <Menu.Item key={data.id} icon={<MyIcon type="icon-message" />}>
      {data.id === selectedKey && isEditing ? (
        <Input
          value={value}
          maxLength={100}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : (
        <span className={styles.text}>{data.name}</span>
      )}
      {data.id === selectedKey && isEditing ? (
        <Space>
          <CheckOutlined onClick={() => handleEditTopic(data.id)} />
          <CloseOutlined onClick={() => setIsEditing(false)} />
        </Space>
      ) : (
        <Space>
          <MyIcon
            type="icon-edit"
            onClick={() => {
              setIsEditing(true);
              setValue(data.name);
            }}
          />
          <MyIcon
            type="icon-delete-light"
            onClick={() => handleDeleteTopic(data.id)}
          />
        </Space>
      )}
    </Menu.Item>
  ));
  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  }

  const btnItems: MenuItem[] = [
    getItem('Clear Conversations', '1', <MyIcon type="icon-delete" />),
    getItem('Dark Mode', '2', <MyIcon type="icon-moon" />),
    getItem('My Account', '3', <MyIcon type="icon-account" />),
    getItem('Updates & FAQ', '4', <MyIcon type="icon-forward" />),
    getItem(
      'Log Out',
      '5',
      <MyIcon type="icon-logout" onClick={handleLogOut} />,
    ),
  ];

  return (
    <div className={styles.nav}>
      <div className={styles.create}>
        <Button onClick={handleAddTopic} icon={<PlusOutlined />}>
          New Chat
        </Button>
      </div>
      <div className={styles.conversations}>
        <Menu selectedKeys={[selectedKey as string]} onSelect={handleSelect}>
          {contentLists}
        </Menu>
      </div>
      <div className={styles.menu}>
        <Menu items={btnItems} />
      </div>
    </div>
  );
}

type navProps = {};
interface Topic {
  id: string;
  name: string;
}
