import { RecommendedUser, Result } from '../types';
import axios from './axios';

class UserService {
  async login() {
    console.log('로그인합니다.');

    await axios.post('/graphql', {
      query:
        'mutation($username:String!,$password:String!,$rememberme:Boolean,$captchaValue:String,$captchaKey:String,$captchaType:String){signinByUsername(username:$username,password:$password,rememberme:$rememberme,captchaValue:$captchaValue,captchaKey:$captchaKey,captchaType:$captchaType){id username nickname role isEmailAuth isSnsAuth isPhoneAuth studentTerm alarmDisabled status{userStatus}profileImage{id name label{ko en ja vn}filename imageType dimension{width height}trimmed{filename width height}}banned{username nickname reason bannedCount bannedType projectId startDate userReflect{status endDate}}isProfileBlocked}}',
      variables: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        rememberme: true,
      },
    });

    console.log('로그인했습니다.');
  }

  async getId(username: string, retry = false): Promise<Result<string>> {
    try {
      const { data } = await axios.post('/graphql', {
        query: 'query($username:String){user(username:$username){id}}',
        variables: { username },
      });
      if (data.errors?.length > 0) {
        const { statusCode } = data.errors[0];

        if (!retry && statusCode === 401) {
          await this.login();
          return await this.getId(username, true);
        } else return { success: false, error: `Error: ${statusCode}` };
      }
      if (!data.data.user.id) return { success: false, error: 'notfound' };

      return { success: true, data: data.data.user.id };
    } catch (error) {
      return { success: false, error };
    }
  }

  async getRecommendedUsers(retry = false): Promise<Result<RecommendedUser[]>> {
    try {
      const { data } = await axios.post('/graphql', {
        query:
          'query SELECT_RECOMMEND_MAKER{recommendMakerList{total list{id keyword1 keyword2 keyword3 user{id nickname username profileImage{id name label{ko en ja vn}filename imageType dimension{width height}trimmed{filename width height}}description}}}}',
        variables: {},
      });
      if (data.errors?.length > 0) {
        const { statusCode } = data.errors[0];

        if (!retry && statusCode === 401) {
          await this.login();
          return await this.getRecommendedUsers();
        } else return { success: false, error: `Error: ${statusCode}` };
      }

      return { success: true, data: data.data.recommendMakerList.list };
    } catch (error) {
      return { success: false, error };
    }
  }

  async getProjects(id: string, retry = false): Promise<Result<any>> {
    try {
      const { data } = await axios.post('/graphql', {
        query:
          'query SELECT_USER_PROJECTS($user:String!,$query:String,$categoryCode:String,$groupId:ID,$pageParam:PageParam,$isOpen:Boolean,$except:[ID],$searchAfter:JSON,$searchType:String){userProjectList(user:$user,query:$query,categoryCode:$categoryCode,groupId:$groupId,pageParam:$pageParam,isOpen:$isOpen,except:$except,searchAfter:$searchAfter,searchType:$searchType){total list{id name user{id username nickname profileImage{id filename imageType}}thumb isopen isPracticalCourse category categoryCode created updated special isForLecture isForStudy isForSubmit hashId complexity staffPicked ranked visit likeCnt comment}searchAfter}}',
        variables: {
          pageParam: {
            display: 10000,
            sort: 'likeCnt',
          },
          searchType: 'scroll',
          term: 'all',
          user: id,
        },
      });
      if (data.errors?.length > 0) {
        const { statusCode } = data.errors[0];

        if (!retry && statusCode === 401) {
          await this.login();
          return await this.getProjects(id);
        } else return { success: false, error: `Error: ${statusCode}` };
      }

      return { success: true, data: data.data.userProjectList.list };
    } catch (error) {
      return { success: false, error };
    }
  }

  async getProjectIds(id: string, retry = false): Promise<Result<any>> {
    try {
      const { data } = await axios.post('/graphql', {
        query:
          'query SELECT_USER_PROJECTS($user:String!,$query:String,$categoryCode:String,$groupId:ID,$pageParam:PageParam,$isOpen:Boolean,$except:[ID],$searchAfter:JSON,$searchType:String){userProjectList(user:$user,query:$query,categoryCode:$categoryCode,groupId:$groupId,pageParam:$pageParam,isOpen:$isOpen,except:$except,searchAfter:$searchAfter,searchType:$searchType){list{id}}}',
        variables: {
          pageParam: {
            display: 10000,
            sort: 'likeCnt',
          },
          searchType: 'scroll',
          term: 'all',
          user: id,
        },
      });
      if (data.errors?.length > 0) {
        const { statusCode } = data.errors[0];

        if (!retry && statusCode === 401) {
          await this.login();
          return await this.getProjects(id);
        } else return { success: false, error: `Error: ${statusCode}` };
      }

      return { success: true, data: data.data.userProjectList.list };
    } catch (error) {
      return { success: false, error };
    }
  }

  async getUserInfo(id: string, retry = false): Promise<Result<any>> {
    try {
      const { data } = await axios.post('/graphql', {
        query:
          'query FIND_USERSTATUS_BY_USERNAME($id:String){userstatus(id:$id){id nickname username description shortUrl profileImage{id name label{ko en ja vn}filename imageType dimension{width height}trimmed{filename width height}}coverImage{id name label{ko en ja vn}filename imageType dimension{width height}trimmed{filename width height}}role studentTerm status{project projectAll study studyAll community{qna tips free}following follower bookmark{project study}userStatus}created}}',
        variables: { id },
      });
      if (data.errors?.length > 0) {
        const { statusCode } = data.errors[0];

        if (!retry && statusCode === 401) {
          await this.login();
          return await this.getProjects(id);
        } else return { success: false, error: `Error: ${statusCode}` };
      }

      return { success: true, data: data.data.userstatus };
    } catch (error) {
      return { success: false, error };
    }
  }

  async getBookmarks(id: string, retry = false): Promise<Result<any>> {
    try {
      const { data } = await axios.post('/graphql', {
        query:
          'query SELECT_PROJECT_LITE($id:ID!,$groupId:ID){project(id:$id,groupId:$groupId){favorite}}',
        variables: { id },
      });
      if (data.errors?.length > 0) {
        const { statusCode } = data.errors[0];

        if (!retry && statusCode === 401) {
          await this.login();
          return await this.getProjects(id);
        } else return { success: false, error: `Error: ${statusCode}` };
      }

      return { success: true, data: data.data.project.favorite };
    } catch (error) {
      return { success: false, error };
    }
  }
}

export default UserService;
