import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

let savedFeedData = JSON.parse(localStorage.getItem("feed"));
let feedData = tweetsData;

if (savedFeedData) {
  feedData = savedFeedData;
  render();
}

document.addEventListener("click", function (e) {
  if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.button) {
    handleTweetBtnClick();
  } else if (e.target.dataset.comment) {
    openCommentBox(e.target.dataset.comment);
  } else if (e.target.dataset.post) {
    postComment(e.target.dataset.post);
  } else if(e.target.dataset.delete) {
    deleteComment(e.target.dataset.delete)
  }
});

function handleLikeClick(tweetId) {
  feedData.forEach(tweet => {
    if (tweet.uuid === tweetId) {
      const targetTweetObj = tweet;
      if (!targetTweetObj.isLiked) {
        targetTweetObj.likes++;
      } else {
        targetTweetObj.likes--;
      }
      targetTweetObj.isLiked = !targetTweetObj.isLiked;
      render();
    }
  });
}

function handleRetweetClick(tweetId) {
  feedData.forEach(tweet => {
    if (tweet.uuid === tweetId) {
      const targetTweetObj = tweet;
      if (!targetTweetObj.isRetweeted) {
        targetTweetObj.retweets++;
      } else {
        targetTweetObj.retweets--;
      }
      targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
      render();
    }
  });
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");
  if (tweetInput.value) {
    feedData.unshift({
      handle: "@Scrimba",
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: `${tweetInput.value}`,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: `${uuidv4()}`,
    });
    localStorage.setItem("feed", JSON.stringify(feedData));
    tweetInput.value = "";
    render();
  }
}

function getFeedHtml() {
  let feedHtml = "";

  feedData.forEach(tweet => {
    const likeIconClass = tweet.isLiked ? "liked" : ''

    const retweetIconClass = tweet.isRetweeted ? 'retweeted' : ''

    let commentIconClass = "";

    let repliesHtml = "";

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(reply => {
        repliesHtml += `
        <div class="tweet-reply">
          <div class="tweet-inner">
          <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
          </div>
        </div>
        `;
      });
    }

    feedHtml += `
  <div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <textarea class="comment-box hidden" id='comment-box-${tweet.uuid}' placeholder='Write comment here'></textarea>
            <button class='post-comment hidden' id='post-comment-${tweet.uuid}' data-post='${tweet.uuid}'>post comment</button>
            <div class="tweet-details">
                <span class="tweet-detail">
                <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}" title="view comments"></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}" title="like"></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}" title="retweet"></i>
                    ${tweet.retweets}
                </span>
                <span class='tweet-detail'>
                <i class="fa-solid fa-reply ${commentIconClass}" data-comment="${tweet.uuid}" title="reply"></i>
                </span>
                <span class="tweet-detail">
                <i class="fa-solid fa-trash" data-delete="${tweet.uuid}" title="delete tweet"></i>
                </span>
            </div> 
        </div>            
    </div>

    <div class="hidden" id="replies-${tweet.uuid}">
      ${repliesHtml}
  </div>   
</div>
  `;
  });
  return feedHtml;
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

render();

function handleReplyClick(replyId) {
  feedData.forEach(tweet => {
    if (tweet.uuid === replyId) {
      document
        .getElementById(`replies-${tweet.uuid}`)
        .classList.toggle("hidden");
    }
  });
}

function openCommentBox(tweetId) {
  feedData.forEach(tweet => {
    if (tweet.uuid === tweetId) {
      document
        .getElementById(`comment-box-${tweet.uuid}`)
        .classList.toggle("hidden");
      document
        .getElementById(`post-comment-${tweet.uuid}`)
        .classList.toggle("hidden");
    }
  });
}

function postComment(tweetId) {
  feedData.forEach(tweet => {
    const commentBtn = document.getElementById(`comment-box-${tweet.uuid}`);
    if (commentBtn.value.length > 0) {
      if (tweet.uuid === tweetId) {
        tweet.replies.push({
          handle: "@Scrimba",
          profilePic: `images/scrimbalogo.png`,
          likes: 0,
          retweets: 0,
          tweetText: document.getElementById(`comment-box-${tweet.uuid}`).value,
          replies: [],
          isLiked: false,
          isRetweeted: false,
          uuid: `${uuidv4()}`,
        });
        render();
      }
    }
  });
}

function deleteComment(tweetId) {
  feedData.forEach(tweet => {
    if(tweet.uuid === tweetId) {
      feedData.shift(tweet)
      render()
    }
  })
}

