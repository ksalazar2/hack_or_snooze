"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  if (currentUser.isFavorite(story.storyId)) {
    return $(`
      <li id="${story.storyId}">
      <i class="fa-solid fa-star favIndicator"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
  } else {
    return $(`
    <li id="${story.storyId}">
    <i class="fa-regular fa-star favIndicator"></i>
      <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
    </li>
  `);
  }
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();
  $favStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
    // if (currentUser.isFavorite(story.storyId)) {
    //   $favStoriesList.append($story);
    // };
  }

  // loop through all favorite stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function submitStory(e) {
  e.preventDefault();
  const storyTitle = $('#submit-title').val();
  const storyAuthor = $('#submit-author').val();
  const storyURL = $('#submit-url').val();
  const storyUsername = currentUser.username;
  const newStory = await storyList.addStory(currentUser, { title: storyTitle, author: storyAuthor, url: storyURL, username: storyUsername });
  const newStoryMU = generateStoryMarkup(newStory);
  $allStoriesList.prepend(newStoryMU);
  $('#submit-title').val('');
  $('#submit-author').val('');
  $('#submit-url').val('');
  $('#submission-form').toggleClass('hidden');
};

$('#submission-form').on('submit', submitStory);

/** UI for favorite stories. Also calls the functions to make data/API changes and recreates favStoriesList **/
async function markFavorite(e) {
  let favID = e.target.parentElement.id;
  $(`#${favID} .favIndicator`).toggleClass('fa-regular');
  $(`#${favID} .favIndicator`).toggleClass('fa-solid');
  if (currentUser.isFavorite(favID)) {
    await currentUser.delFavorite(favID);
  } else {
    let storyArr = storyList.stories;
    let storyInd = storyArr.findIndex((storyObj) => {
      return storyObj.storyId === favID;
    })
    let storyToAdd = storyArr[storyInd];
    await currentUser.addFavorite(storyToAdd);
  }

  $favStoriesList.empty();
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    if (currentUser.isFavorite(story.storyId)) {
      $favStoriesList.append($story);
    };
  }
};

$('#all-stories-list, #favorite-stories-list').on('click', '.favIndicator', markFavorite);