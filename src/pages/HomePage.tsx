import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

function HomePage() {
  //supabase 연결 테스트
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase.from('test').select('*');

      if (error) {
        console.error('Supabase 연결 실패:', error);
      } else {
        console.log('Supabase 연결 성공, 데이터 예시:', data);
      }
    }

    testConnection();
  }, []);
  return <div>홈페이지</div>;
}

export default HomePage;
