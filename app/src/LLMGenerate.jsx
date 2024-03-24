import React, { useState } from 'react';

function LLMGenerate() {
  const [inputText, setInputText] = useState('');
  const [responses, setResponses] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponses(''); // Clear previous responses

    const reader = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'stable-code:3b-code-q4_0',
        prompt: inputText,
      }),
    }).then((response) => response.body.getReader());

    const decoder = new TextDecoder();

    const readStream = () => {
      reader.read().then(({ done, value }) => {
        if (done) {
          console.log('Stream finished.');
          return;
        }
        const chunk = decoder.decode(value, { stream: true });
        try {
          const jsonChunk = JSON.parse(chunk);
          setResponses((prev) => prev + jsonChunk.response);
        } catch (error) {
          console.error('Error parsing JSON chunk', error);
        }
        // Read the next chunk
        readStream();
      }).catch((error) => {
        console.error('Error reading stream', error);
      });
    };

    readStream();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter prompt"
        />
        <button type="submit">Submit</button>
      </form>
      <p>Responses:</p>
      <p>{responses}</p>
    </div>
  );
}

export default LLMGenerate;
