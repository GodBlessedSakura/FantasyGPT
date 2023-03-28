import { useEffect, useState } from 'react';
import { useParams } from 'umi';
import request from '@/utils/request';
import { Dispatch, SetStateAction } from 'react';
import ChatBox from './ChatBox';
import ChatWindow from './ChatWindow';
import styles from './index.less';

export default function Main(props: mainProps) {
  const { id } = useParams();
  const [conversations, setConversations]: [
    Conversation[],
    Dispatch<SetStateAction<Conversation[]>>,
  ] = useState<Conversation[]>([]);
  const getConversations = async (id: string | undefined) => {
    const response = await request.get(`/topic/get/${id}`);
    if (response) {
      setConversations(response?.topic?.conversations);
    }
  };
  useEffect(() => {
    getConversations(id);
  }, [id]);

  return (
    <div className={styles.main}>
      <ChatWindow conversations={conversations} />
      <ChatBox id={id} onSendConversation={getConversations} />
    </div>
  );
}

type mainProps = {};
