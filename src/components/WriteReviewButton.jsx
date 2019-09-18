import React from 'react';

const WriteReviewButton = (props) => {
  return (
    <div id='rev_write_review_holder'>
      <h2 class='rev_write_review_header'>Review this product</h2>
      <span id='rev_share_your_thoughts'>Share your thoughts with other customers</span>
      <button class='rev_leave_review' 
        onClick={(e) => props.renderCompose(e)}>Write a customer review</button>
    </div>
  );
};

export default WriteReviewButton;