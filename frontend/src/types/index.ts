interface User {
  id: string,
  enable: boolean,
  subjects:Array<Topic>
}

interface Topic {
  id: string,
  name:string,
  conversations: Array<Conversation>
}

interface Conversation {
  id:string,
  role:string,
  text:string
}

interface markdownProps {
 children:string
}