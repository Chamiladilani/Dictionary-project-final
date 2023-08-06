import React, { useState } from 'react';
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';

const apiKey = 'a4b7b8d7f03040d792o0ft5d941a335f';

const Audio = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.shecodes.io/dictionary/v1/define?word=${searchTerm}&key=${apiKey}`
      );
      const data = response.data;

      // Assuming the API response contains the audio URL for the word
      if (data.audio) {
        setAudioUrl(data.audio);
      } else {
        setAudioUrl('');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter a word"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {audioUrl && <ReactAudioPlayer src={audioUrl} autoPlay controls />}
    </div>
  );
};

export default Audio;
