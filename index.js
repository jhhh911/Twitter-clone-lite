import { tweetsData } from "./data.js";

const tweetInput = document.getElementById("tweet-input");
const tweetBtn = document.getElementById("tweet-btn");

tweetBtn.addEventListener("click", function () {
  console.log(tweetInput.value);
});

document.addEventListener('click', function(e) {
  if (e.target.dataset.reply) {
    addComment(e.target.dataset.reply)
  } else if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like)
  } else if (e.target.dataset.retweet) {
    retweetTweet(e.target.dataset.retweet)
  }
})

function addComment(commentId) {
  console.log(commentId)
}

function handleLikeClick(tweetId) {
  tweetsData.forEach(tweet => {
    if (tweet.uuid === tweetId) {
      const targetTweetObj = tweet
      targetTweetObj.likes++
      console.log(targetTweetObj)
    }
  })
}

function retweetTweet(retweetId) {
  console.log(retweetId)
}

function getFeedHtml() {
  let feedHtml = "";
  tweetsData.forEach(tweet => {
    feedHtml += `
  <div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                <i class="fa-solid fa-heart" data-like="${tweet.uuid}"></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                <i class="fa-solid fa-retweet" data-retweet="${tweet.uuid}"></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
</div>
  `;
  });
   return feedHtml;
}

const render = () => document.getElementById("feed").innerHTML = getFeedHtml();

render()

