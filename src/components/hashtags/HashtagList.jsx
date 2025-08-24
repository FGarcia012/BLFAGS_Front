import React from 'react';

const HashtagList = ({ hashtags, onSelect }) => (
  <div className="hashtag-list">
    {hashtags.map(h => (
      <div
        key={h.hid}
        className="hashtag-item"
        onClick={() => onSelect(h.name)}
      >
        #{h.name}
      </div>
    ))}
  </div>
);

export default HashtagList;