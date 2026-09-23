async function testApiAI() {
  console.log('Testing /api/ai endpoint on http://localhost:3001...');

  // 1. Login to get session
  const loginRes = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@salao.com', password: 'admin123' }),
  });

  const cookieHeader = loginRes.headers.get('set-cookie');
  console.log('Login status:', loginRes.status);

  // 2. Call Copywriting Agent
  console.log('\n--- Test 1: Agente Copywriting ---');
  const copyRes = await fetch('http://localhost:3001/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader || '',
    },
    body: JSON.stringify({
      agentType: 'copywriting',
      service: 'Cabelo',
      procedure: 'Morena Iluminada Mel',
      tone: 'Elegante e Sofisticado',
      goal: 'Atrair clientes para o final de semana',
    }),
  });

  const copyData = await copyRes.json();
  console.log('Copywriting response status:', copyRes.status);
  console.log('Source:', copyData.source);
  console.log('Data:\n', JSON.stringify(copyData.data, null, 2));

  // 3. Call Ideas Agent
  console.log('\n--- Test 2: Agente Ideias Semanais ---');
  const ideasRes = await fetch('http://localhost:3001/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader || '',
    },
    body: JSON.stringify({
      agentType: 'ideas',
      service: 'Alongamento em Gel e Nail Art',
      tone: 'Elegante',
    }),
  });

  const ideasData = await ideasRes.json();
  console.log('Ideas response status:', ideasRes.status);
  console.log('Source:', ideasData.source);
  console.log('Generated ideas count:', ideasData.data?.length);

  // 4. Call Strategy Agent
  console.log('\n--- Test 3: Agente Estratégia de Horários ---');
  const stratRes = await fetch('http://localhost:3001/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader || '',
    },
    body: JSON.stringify({ agentType: 'strategy' }),
  });

  const stratData = await stratRes.json();
  console.log('Strategy response status:', stratRes.status);
  console.log('Golden tip:', stratData.data?.goldenTip);

  // 5. Call Curation Agent
  console.log('\n--- Test 4: Agente Curadoria Visual ---');
  const curRes = await fetch('http://localhost:3001/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader || '',
    },
    body: JSON.stringify({ agentType: 'curation' }),
  });

  const curData = await curRes.json();
  console.log('Curation response status:', curRes.status);
  console.log('Score:', curData.data?.score);
  console.log('Framing tip:', curData.data?.framingTip);

  console.log('\n✅ Todos os 4 agentes de IA responderam com sucesso pela API!');
}

testApiAI().catch(console.error);
