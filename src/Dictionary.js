import React, { useState } from 'react';
import axios from 'axios';
import AudioPlayer from 'react-audio-player';

const apiKey = 'a4b7b8d7f03040d792o0ft5d941a335f';

const Dictionary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({});

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.shecodes.io/dictionary/v1/define?word=${searchTerm}&key=${apiKey}`
      );
      const data = response.data;

      // Group meanings by part of speech
      const groupedResults = data.meanings.reduce((acc, meaning) => {
        if (!acc[meaning.partOfSpeech]) {
          acc[meaning.partOfSpeech] = [];
        }
        acc[meaning.partOfSpeech].push(meaning);
        return acc;
      }, {});

      setSearchResults(groupedResults);

      // Fetch word images from SheCodes API
      const imagesResponse = await axios.get(
        `https://api.shecodes.io/images/v1/search?query=${searchTerm}&key=${apiKey}`
      );
      const imagesData = imagesResponse.data;

      setSearchResults((prevResults) => ({
        ...prevResults,
        images: imagesData.photos.map((photo) => photo.src.landscape),
      }));
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

      {Object.keys(searchResults).length > 0 ? (
        <>
          {Object.keys(searchResults).map((partOfSpeech, index) => (
            <div key={index}>
              <h3>{partOfSpeech}</h3>
              {searchResults[partOfSpeech].map((result, i) => (
                <div key={i}>
                  <p>{result.definition}</p>
                  {result.synonyms && result.synonyms.length > 0 && (
                    <div>
                      <h4>Synonyms</h4>
                      <ul>
                        {result.synonyms.map((synonym, j) => (
                          <li key={j}>{synonym}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.phonetic && (
                    <p>
                      Phonetic: {result.phonetic}
                      {result.audio && (
                        <AudioPlayer src={result.audio} controls />
                      )}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}
          {searchResults.images && searchResults.images.length > 0 && (
            <div>
              <h4>Images</h4>
              <div className="image-container">
                {searchResults.images.map((image, i) => (
                  <img
                    key={i}
                    src={image}
                    alt={`Image ${i + 1}`}  // Provide a concise and descriptive alt text
                    className="small-image"
                  />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default Dictionary;
