/*
* Create By mryang On 18-3-24
* 模型url 设定
*/

let version = "v1";
const urlRegex = "/v1";

const urlConfig ={
  // 用户模块
  user: {
    url: `/${version}/users/`,

    login: {
      url: `/${version}/users/login/`,
    },
    logout: {
      url: `/${version}/users/register/`
    },

    // 收藏模块
    collection:{
      url: `/${version}/users/{user_id}/collections`,
    },
  },

  // 推荐模块
  recommend:{
    url: `/${version}/recommends/`,

    // 标签模块
    tag: {
      url: `/${version}/tags/`
    }
  },

  // 项目模块
  project:{
    url: `/${version}/projects/`
  },

  // 小组模块
  group:{
    url: `/${version}/groups/`
  },

  // 评论模块
  comment:{
    url: `/${version}/comments/`
  },

  // 话题模块
  topic:{
    url: `/${version}/topics/`
  }
};

export default {urlConfig, urlRegex};


this.$message.error(err.response.data.message);