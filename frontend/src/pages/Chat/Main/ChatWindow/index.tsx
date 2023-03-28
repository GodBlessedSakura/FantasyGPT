import { Avatar } from 'antd';
import SVG from '@/assets/GPT';
import Highlight from 'react-highlight';
import styles from './index.less';

export default function ChatWindow(props: chatWindowProps) {
  const { conversations } = props;

  const getContents = (data: Array<Conversation>): JSX.Element[] => {
    const res = data.map((item) => {
      return (
        <div
          key={item.id}
          style={{
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: item.role === 'user' ? '#fff' : 'rgb(247,247,248)',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            padding: '24px 0 24px 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '100%',
              maxWidth: '76.8rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                marginRight: '2rem',
                justifyContent: 'center',
                alignItems: 'center',
                width: '24px',
                height: '24px',
                background:
                  item.role === 'assistant'
                    ? 'rgb(16, 163, 127)'
                    : 'rgb(216, 163, 127)',
                color: 'white',
              }}
            >
              {item.role === 'assistant' ? <SVG /> : 'U'}
            </div>
            <div style={{ flex: '1' }}>
              <Highlight>{item.text}</Highlight>
            </div>
          </div>
        </div>
      );
    });
    return res;
  };
  return (
    <div className={styles['contents-wrapper']}>
      <header
        style={{
          height: '44px',
          padding: '12px',
          fontSize: '1.4rem',
          backgroundColor: 'rgb(247,247,248)',
          color: 'rgb(142,142,160)',
          textAlign: 'center',
        }}
      >
        Model: Default (GPT - 3.5)
      </header>
      <div style={{ overflowY: 'auto' }}>{getContents(conversations)}</div>
      <footer style={{ height: '192px' }}></footer>
    </div>
  );
}

interface chatWindowProps {
  conversations: Conversation[];
}
interface Conversation {
  id: string;
  role: string;
  text: string;
}
