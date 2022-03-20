import PostService from '../services/post.service';

const initialState = {
    posts: []
};

export const post = {
  namespaced: true,
  state: initialState,
  actions: {
    getPosts({ commit }) {
      return PostService.getListPost().then(
        posts => {
          commit('getPostsSuccess', posts.data.posts);
          return Promise.resolve(posts.data.posts);
        },
        error => {
          commit('getPostsFail');
          return Promise.reject(error);
        }
      );
    },
  },
  mutations: {
    getPostsSuccess(state, posts) {
      state.posts = posts;
    },
    getPostsFail() {
        // TODO
    }
  },
  getters: {
    posts(state) {
        return state.posts;
    }
  }
};
