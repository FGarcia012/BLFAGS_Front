
import React from 'react';
import PublicationCard from '../publications/PublicationCard';

const HashtagPublications = ({ hashtag, publications }) => (
  <div>
    {publications.length === 0 ? (
      <p>No hay publicaciones para este hashtag.</p>
    ) : (
      <div className="hashtag-publications-list">
        {publications.map((pub, idx) => (
          <PublicationCard key={pub._id || pub.id || idx} publication={pub} />
        ))}
      </div>
    )}
  </div>
);

export default HashtagPublications;