import { Router } from 'express';
import UserService from '../lib/user';
import { ProjectInfo, UserInfo } from '../types';
import recommendedUsers from '../../recommendedUsers.json';

const userRouter = Router();
const userService = new UserService();

// const tmp: any = {};

userRouter.get('/getRecommendedUsers', async (_req, res) => {
  try {
    const getRecommendedUsersRes = await userService.getRecommendedUsers();
    if (!getRecommendedUsersRes.success)
      return res.json(getRecommendedUsersRes);

    const randomUsers: string[] = [];

    while (randomUsers.length < 3) {
      const randomInt = ((min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      })(0, recommendedUsers.length - 1);

      if (!randomUsers.includes(recommendedUsers[randomInt].username))
        randomUsers.push(recommendedUsers[randomInt].username);
    }

    // const recommendedUsers = getRecommendedUsersRes.data.map(
    //   ({ id, keyword1, keyword2, keyword3, user }) => ({
    //     id,
    //     keywords: [keyword1, keyword2, keyword3].filter(
    //       (keyword) => keyword !== null && keyword.trim() !== ''
    //     ),
    //     userId: user.id,
    //     nickname: user.nickname,
    //     username: user.username,
    //     profileImage: `https://playentry.org/uploads/${user.profileImage.filename.slice(
    //       0,
    //       2
    //     )}/${user.profileImage.filename.slice(2, 4)}/${
    //       user.profileImage.filename
    //     }.${user.profileImage.imageType}`,
    //     description: user.description,
    //   })
    // );

    // console.log('--------------------'.repeat(20));

    // recommendedUsers.forEach((user) => {
    //   tmp[user.username] = user;
    // });

    // console.log(JSON.stringify(tmp), Object.keys(tmp).length);

    return res.json({
      success: true,
      data: randomUsers.map((username) =>
        recommendedUsers.find((user) => user.username === username)
      ),
    });
  } catch (_) {}
});

userRouter.get('/getUserInfo/:username', async (req, res) => {
  const { username }: { username: string } = req.params;

  try {
    const getIdRes = await userService.getId(username);
    if (!getIdRes.success) return res.json(getIdRes);

    const id = getIdRes.data;

    const [getProjectsRes, getUserInfoRes] = await Promise.all([
      userService.getProjects(id),
      userService.getUserInfo(id),
    ]);
    if (!getProjectsRes.success) return res.json(getProjectsRes);
    if (!getUserInfoRes.success) return res.json(getUserInfoRes);

    const projectInfo: ProjectInfo[] = getProjectsRes.data.map(
      (project: any) =>
        ({
          id: project.id,
          name: project.name,
          thumb: `https://playentry.org/${project.thumb}`,
          category:
            project.categoryCode === 'game'
              ? '게임'
              : project.categoryCode === 'living'
              ? '생활과 도구'
              : project.categoryCode === 'storytelling'
              ? '스토리텔링'
              : project.categoryCode === 'arts'
              ? '예술'
              : project.categoryCode === 'knowledge'
              ? '지식 공유'
              : '기타',
          created: Date.parse(project.created).toString(),
          updated: Date.parse(project.updated).toString(),
          staffPicked: project.staffPicked
            ? Date.parse(project.staffPicked).toString()
            : null,
          ranked: project.ranked ? Date.parse(project.ranked).toString() : null,
          visits: project.visit,
          likes: project.likeCnt,
          comments: project.comment,
        } as unknown as ProjectInfo)
    );

    const userInfo: UserInfo = {
      id: getUserInfoRes.data.id,
      nickname: getUserInfoRes.data.nickname,
      username: getUserInfoRes.data.username,
      description: getUserInfoRes.data.description,
      shortUrl: getUserInfoRes.data.shortUrl,
      profileImage:
        getUserInfoRes.data.profileImage !== null
          ? `https://playentry.org/uploads/${getUserInfoRes.data.profileImage.filename.slice(
              0,
              2
            )}/${getUserInfoRes.data.profileImage.filename.slice(2, 4)}/${
              getUserInfoRes.data.profileImage.filename
            }.${getUserInfoRes.data.profileImage.imageType}`
          : null,
      coverImage:
        getUserInfoRes.data.coverImage !== null
          ? `https://playentry.org/uploads/${getUserInfoRes.data.coverImage.filename.slice(
              0,
              2
            )}/${getUserInfoRes.data.coverImage.filename.slice(2, 4)}/${
              getUserInfoRes.data.coverImage.filename
            }.${getUserInfoRes.data.coverImage.imageType}`
          : null,
      role: getUserInfoRes.data.role,
      status: getUserInfoRes.data.status,
      projects: projectInfo,
      created: Date.parse(getUserInfoRes.data.created).toString(),
    };

    return res.json({ success: true, data: userInfo });
  } catch (_) {}
});

userRouter.get('/getBookmarks/:username', async (req, res) => {
  const { username }: { username: string } = req.params;

  try {
    const getIdRes = await userService.getId(username);
    if (!getIdRes.success) return res.json(getIdRes);

    const id = getIdRes.data;

    const getProjectsRes = await userService.getProjectIds(id);
    if (!getProjectsRes.success) return res.json(getProjectsRes);

    const bookmarks = (
      await Promise.all(
        getProjectsRes.data.map((project: any) =>
          userService.getBookmarks(project.id)
        )
      )
    )
      .filter((res) => res.success)
      .reduce((acc, cur) => (acc += cur.data), 0);

    return res.json({ success: true, data: bookmarks });
  } catch (_) {}
});

export default userRouter;
