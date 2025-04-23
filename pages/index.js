// pages/index.js
export async function getServerSideProps(context) {
    const { sn = '' } = context.query;              // ?sn=XXX 파라미터도 넘기고 싶다면
    return {
      redirect: {
        destination: `/register?sn=${sn}`,          // /register 경로로 리다이렉트
        permanent: false,                            // 임시 리다이렉트
      },
    };
  }
  
  export default function Home() {
    return null;   // 이 컴포넌트는 렌더링되지 않음
  }
  