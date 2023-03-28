import { Menu } from 'antd';
import { ReactNode } from 'react';

export default function Subject(props: subjectProps) {
  const { id, icon, title } = props;
  return (
    <Menu.Item key={id} icon={icon}>
      {title}
    </Menu.Item>
  );
}

type subjectProps = {
  id: string;
  icon: ReactNode;
  title: string;
  isSelected: boolean;
};
