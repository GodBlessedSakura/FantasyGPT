export default function Main() {
  return (
    <div
      style={{
        flex: '1',
        display: 'flex',
        flexFlow: 'column wrap',
        alignItems: 'center',
        paddingTop: '50px',
      }}
    >
      <div style={{ fontSize: '2rem', fontWeight: 500 }}>
        Model: GPT-3.5-turbo
      </div>
      <div
        style={{
          marginTop: '180px',
          display: 'flex',
          flexFlow: 'column wrap',
          alignItems: 'center',
          color: 'rgba(217,217,227,0.8)',
          fontSize: '3rem',
          fontWeight: 600,
        }}
      >
        <div>Create A New Chat</div>
        <br />
        <div>OR</div>
        <br />
        <div>Open An Existing Chat</div>
      </div>
    </div>
  );
}
