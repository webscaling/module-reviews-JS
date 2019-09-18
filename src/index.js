import React from 'react';
import ReactDOM from 'react-dom';
import ReviewSummary from './components/ReviewSummary/ReviewSummary.jsx';
import WriteReviewButton from './components/WriteReviewButton.jsx';
import ReviewContainer from './components/ReviewContainer/ReviewContainer.jsx';
import axios from 'axios';
import ComposeReview from './components/ComposeReview.jsx';

class ReviewsApp extends React.Component {
  constructor() {
    super();

    this.state = {
      currentItem: Math.floor(Math.random() * 10000000) + 1,
      writeReview: false,
      itemReviews: [],
      listOrder: ['Top Reviews', 'Most Recent'],
      sort: 'top',
      allowHelpfulChange: true,
      currentUser: 'Zubair'
    };

    this.handleSortChange = this.handleSortChange.bind(this);
  }

  componentDidMount() {
    this.getReviewsForItem(this.state.currentItem);
    window.addEventListener('clickedProduct', (event) => {
      let product = event.detail;
      if (product) {
        this.setState(
          {
            currentItem: product
          }, ()=> this.getReviewsForItem(this.state.currentItem));
      }
    });
    
  }

  getReviewsForItem(queryItemID) {
    axios.get('/itemReviews', {
      params: {
        itemID: queryItemID,
        user: this.state.currentUser
      }
    })
    .then((response) => {
      let newReviews = response.data;
      let newReviewsSorted = newReviews.slice().sort((a, b) => {
        return b.helpfulCount - a.helpfulCount;
      }) 
      this.setState({
        itemReviews: newReviewsSorted,
      }, ()=> {
        this.sendReviewEvent(newReviewsSorted);
        if(this.state.sort === 'recent') this.sortReviewsByDate();
      })
    })
  }

  sortReviewsByHelpful() {
    let newReviews = this.state.itemReviews;
    let newReviewsSorted = newReviews.slice().sort((a, b) => {
      return b.helpfulCount - a.helpfulCount;
    })
    this.setState({
      itemReviews: newReviewsSorted,
      sort: 'top'
    })
  }

  sortReviewsByDate() {
    let newReviews = this.state.itemReviews;
    let newReviewsSorted = newReviews.slice().sort((a, b) => {
      let aDate = new Date(a.date);
      let bDate = new Date(b.date);
      return bDate - aDate;
    });
    this.setState({
      itemReviews: newReviewsSorted,
      sort: 'recent'
    });
  }

  handleSortChange(event) {
    if(event.target.value === 'Most Recent'){
      this.sortReviewsByDate();
    } else if(event.target.value === 'Top Reviews'){
      this.sortReviewsByHelpful();
    }
  }

  renderCompose(cancelWasPressed){
    this.setState({
      writeReview: !this.state.writeReview
    }, ()=> {
      if (cancelWasPressed === undefined) {
        this.componentDidMount();
        setTimeout(function() {
          this.sortReviewsByDate();
        }.bind(this), 200)
        this.setState({
          listOrder: ['Most Recent', 'Top Reviews']
        })
      } else {
        if(this.state.sort === 'recent'){
          this.setState({
            listOrder: ['Most Recent', 'Top Reviews']
          })
        }
      }
    })
  }

  handleHelpful(review) {
    if (this.state.allowHelpfulChange) {
      axios.patch('/updateHelpful', {
        reviewObj: review,
        user: this.state.currentUser
      })
      .then(()=> this.getReviewsForItem(this.state.currentItem))
      // multiple successive calls to the helpful endpoint mess up tracking
      // due to async issues, even with server-side handling. Here, we are
      // handling it client-side as well
      .then(() => {
        this.setState({allowHelpfulChange: !this.state.allowHelpfulChange});
        setTimeout(() => {
          this.setState({allowHelpfulChange: !this.state.allowHelpfulChange});
        }, 1000);
      });
    }
  }

  sendReviewEvent(reviews = this.state.itemReviews) {

    let sumReviews = 0;
    let numReviews = reviews.length;

    let ratingTracker = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };

    reviews.forEach(review => {
      sumReviews += review.rating;
      ratingTracker[review.rating]++;
    });
  
    let avgReviews = Number((sumReviews / numReviews).toFixed(1));

    let event = new CustomEvent('reviewUpdate', {
      detail: {
        numReviews: reviews.length,
        reviewsAvg: avgReviews,
        reviewBreakdown: ratingTracker
      }
    });
    setTimeout(() => {
      window.dispatchEvent(event);
    }, 500)
  }

  render() {
    return (
      <div id='rev_component_holder' role='main'>
        <div id='rev_aggregate_rev_container'>
          <ReviewSummary reviewArray={this.state.itemReviews}/>
          { this.state.writeReview ? null : <WriteReviewButton 
            renderCompose={this.renderCompose.bind(this)}/> }
        </div>
        {
          this.state.writeReview ? 
          <ComposeReview 
            currentItem={this.state.currentItem}
            flipToReviews={this.renderCompose.bind(this)}
            sendReviewEvent={this.sendReviewEvent.bind(this)}
            currentUser={this.state.currentUser}/> 
            : 
          <ReviewContainer 
            listOrder={this.state.listOrder}
            reviewArray={this.state.itemReviews} 
            handleSortChange={this.handleSortChange}
            handleHelpful={this.handleHelpful.bind(this)}
            currentUser={this.state.currentUser}/>
        }
      </div>
    );
  }
}

ReactDOM.render(<ReviewsApp />, document.getElementById('reviewsApp'));