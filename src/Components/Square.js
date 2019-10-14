import React from 'react';

const Square = props => {
  const { classSquare, value } = props;
  return (
    <div>
      <button
        type="button"
        className={classSquare}
        onClick={() => props.onClick()}
      >
        {value}
      </button>
    </div>
  );
};

export default Square;
