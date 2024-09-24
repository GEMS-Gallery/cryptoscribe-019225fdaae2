import { backend } from 'declarations/backend';

let quill;

document.addEventListener('DOMContentLoaded', async () => {
  quill = new Quill('#editor', {
    theme: 'snow'
  });

  const newPostBtn = document.getElementById('newPostBtn');
  const newPostForm = document.getElementById('newPostForm');
  const postForm = document.getElementById('postForm');

  newPostBtn.addEventListener('click', () => {
    newPostForm.style.display = newPostForm.style.display === 'none' ? 'block' : 'none';
  });

  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('postTitle').value;
    const author = document.getElementById('postAuthor').value;
    const body = quill.root.innerHTML;

    try {
      await backend.addPost(title, body, author);
      alert('Post added successfully!');
      postForm.reset();
      quill.setContents([]);
      newPostForm.style.display = 'none';
      await loadPosts();
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Failed to add post. Please try again.');
    }
  });

  await loadPosts();
});

async function loadPosts() {
  try {
    const posts = await backend.getPosts();
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';

    posts.forEach(post => {
      const postElement = document.createElement('article');
      postElement.className = 'post';
      postElement.innerHTML = `
        <h2>${post.title}</h2>
        <p class="author">By ${post.author}</p>
        <p class="timestamp">${new Date(Number(post.timestamp) / 1000000).toLocaleString()}</p>
        <div class="post-body">${post.body}</div>
      `;
      postsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error('Error loading posts:', error);
    alert('Failed to load posts. Please try again.');
  }
}
