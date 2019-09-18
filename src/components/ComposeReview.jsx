import React from 'react';
import axios from 'axios';

class ComposeReview extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      title: '',
      review: '',
      starArray: [false, false, false, false, false],
      rating: 0, 
    };
  }

  collectTitle(event) {
    this.setState({
      title: event.target.value
    });
  }

  collectReview(event) {
    this.setState({
      review: event.target.value
    });
  }

  handleStarMouseOver(event) {
    let index = Number(event.target.id) + 1;
    let newArr = new Array(index).fill(true).concat(new Array(5 - index).fill(false));
    this.setState({
      starArray: newArr,
    });

  }

  handleStarMouseLeave() {
    if (this.state.rating === 0) {
      this.setState({
        starArray: [false, false, false, false, false]
      });
    } else {
      let index = this.state.rating;
      let newArr = new Array(index).fill(true).concat(new Array(5 - index).fill(false));
      this.setState({
        starArray: newArr,
      });
    }
  }

  handleStarMouseDown(event) {
    let index = Number(event.target.id) + 1;
    let newArr = new Array(index).fill(true).concat(new Array(5 - index).fill(false));
    this.setState({
      starArray: newArr,
      rating: index
    });
  }

  submitReview(event, itemID) {
    event.preventDefault();

    let review = this.state.review;
    if (this.state.title !== '' && review.length >= 10 && this.rating !== 0) {
      axios.post('/publishReview', {
        rating: this.state.rating,
        title: this.state.title,
        review: this.state.review,
        itemID: this.props.currentItem,
        author: this.props.currentUser
      })
      .then(()=> this.props.flipToReviews());
    } else {
      if (this.state.rating === 0) {
        alert('Please provide a rating');
      } else if (this.state.title === '') {
        alert('Please title your review');
      } else if (review.length < 10) {
        alert('Reviews must be more than 10 characters long');
      }
    }
  }

  submitReviewAccess(event) {
    event.preventDefault();
    let eventID = event.target.id;
    let rating = Number(eventID[eventID.length - 1]);
    this.setState({rating: rating});
  }

  cancelReview() {
    this.props.flipToReviews(true);
  }

  render() {
    return (
      <div id='rev_compose_container'>
        <h2>Review your purchase</h2>
        <p aria-hidden='false'
          aria-label='Write a title, write a review, click a star rating button 
        and then hit submit to submit a review'
          className={'rev_aria_hidden'}></p>
        <form id='rev_review_field_holder'>

          <label aria-hidden='true'>Overall rating</label>
          <br />
          <div className='rev_star_container rev_rev_stars'>
            {
              this.state.starArray.map((star, index) => {

                if (!star) {
                  return <i className={'far fa-star rev_agg_star rev_compose_stars'}
                    onMouseEnter={(e)=> this.handleStarMouseOver(e)}
                    onMouseLeave={()=> this.handleStarMouseLeave()}
                    id={index}
                    aria-label='One Star'></i>
                } else {
                  return <i className={'fas fa-star rev_agg_star rev_compose_stars'}
                    onMouseEnter={(e)=> this.handleStarMouseOver(e)}
                    onMouseLeave={()=> this.handleStarMouseLeave()}
                    onMouseDown={(e)=> this.handleStarMouseDown(e)}
                    id={index}></i>
                }
              })
            }
          </div>
          <br />

          <label>Add a headline</label>
          <br />
          <input className={'rev_input'} 
            onChange={(e)=> this.collectTitle(e)}></input>
          <br />

          <label>Write your review</label>
          <br />
          <textarea id='rev_review_body'
            onChange={(e)=> this.collectReview(e)}></textarea>
          <br />

          <div id='rev_access_stars'>
            <label aria-label='Select a rating button between 1 and 5 stars'></label>
            <button id='rev_access_1' 
              onClick={(e)=> this.submitReviewAccess(e)}
              aria-hidden='false'>One Star</button>
            <button id='rev_access_2' 
              onClick={(e)=> this.submitReviewAccess(e)}
              aria-hidden='false'>Two Stars</button>
            <button id='rev_access_3' 
              onClick={(e)=> this.submitReviewAccess(e)}
              aria-hidden='false'>Three Stars</button>
            <button id='rev_access_4' 
              onClick={(e)=> this.submitReviewAccess(e)}
              aria-hidden='false'>Four Stars</button>
            <button id='rev_access_5' 
              onClick={(e)=> this.submitReviewAccess(e)}
              aria-hidden='false'>Five Stars</button>
          </div>

          <div id='rev_compose_button_container'>
            <button id='rev_compose_cancel' 
              onClick={(e)=> this.cancelReview(e)}>Cancel</button>
            
            <button id='rev_submit_review' 
              onClick={(e)=> this.submitReview(e)}>Submit</button>
          </div>

        </form>
      </div>
    );
  }
}

export default ComposeReview;
