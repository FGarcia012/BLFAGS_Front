import React, { useState, useEffect } from 'react';
import { fetchHashtags, searchHashtags, fetchPublicationsByHashtag } from '../../services/api';
import HashtagList from '../../components/hashtags/HashtagList';
import HashtagSearch from '../../components/hashtags/HashtagSearch';
import HashtagPublications from '../../components/hashtags/HashtagPublications';
import Navbar from '../../components/navbar/Navbar';
import './HashtagsPage.css';

const HashtagsPage = () => {
  const [hashtags, setHashtags] = useState([]);
  const [selectedHashtag, setSelectedHashtag] = useState(null);
  const [publications, setPublications] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchHashtags().then(data => setHashtags(data.hashtags || []));
  }, []);

  const handleSearch = (query) => {
    searchHashtags(query).then(data => setSearchResults(data.hashtags || []));
  };

  const handleSelectHashtag = (name) => {
    setSelectedHashtag(name);
    fetchPublicationsByHashtag(name).then(data => setPublications(data.publications || []));
  };

  return (
    <>
      <Navbar />
      <div className="hashtags-container">
      <HashtagSearch onSearch={handleSearch} />
      <HashtagList hashtags={searchResults.length ? searchResults : hashtags} onSelect={handleSelectHashtag} />
      {selectedHashtag && (
        <HashtagPublications hashtag={selectedHashtag} publications={publications} />
      )}
      </div>
    </>
  );
};

export default HashtagsPage;