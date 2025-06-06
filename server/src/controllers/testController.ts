/**
 * Node modules
 */
import { NextFunction, Request, Response } from 'express';

/**
 * Utils
 */
import prisma from '../utils/prisma';

/**
 * Types
 */
import {
  CategoryType,
  Comment,
  Issue,
  IssuePriority,
  IssueStatus,
  IssueType,
  Project,
  User,
} from '@prisma/client';

export const testController = {
  async createDatabase(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const project = await seedProject(tx);

        const users = await seedUsers(tx, project);

        const issues = await seedIssues(tx, project, users);

        const comments = await seedComments(tx, issues, users);

        return { project, users, issues, comments };
      });

      res.status(201).json({
        message: 'Database seeded successfully',
        data: {
          projectCount: 1,
          userCount: result.users.length,
          issueCount: result.issues.length,
          commentCount: result.comments.length,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

const seedProject = async (tx: any): Promise<Project> => {
  return tx.project.create({
    data: {
      name: 'singularity 1.0',
      url: 'https://www.atlassian.com/software/jira',
      description:
        'Plan, track, and manage your agile and software development projects in Jira. Customize your workflow, collaborate, and release great software.',
      category: CategoryType.SOFTWARE,
    },
  });
};

const seedUsers = async (tx: any, project: Project): Promise<User[]> => {
  const userData = [
    {
      email: 'rick@jira.guest',
      name: 'Pickle Rick',
      avatarUrl: 'https://i.ibb.co/7JM1P2r/picke-rick.jpg',
      projectId: project.id,
    },
    {
      email: 'yoda@jira.guest',
      name: 'Baby Yoda',
      avatarUrl: 'https://i.ibb.co/6n0hLML/baby-yoda.jpg',
      projectId: project.id,
    },
    {
      email: 'gaben@jira.guest',
      name: 'Lord Gaben',
      avatarUrl: 'https://i.ibb.co/6RJ5hq6/gaben.jpg',
      projectId: project.id,
    },
  ];

  return Promise.all(userData.map((data) => tx.user.create({ data })));
};

const seedIssues = async (
  tx: any,
  project: Project,
  users: User[],
): Promise<Issue[]> => {
  const issueData = [
    {
      title: 'This is an issue of type: Task.',
      type: IssueType.TASK,
      status: IssueStatus.BACKLOG,
      priority: IssuePriority.HIGH,
      listPosition: 1,
      description: `<p>Your teams can collaborate in Jira applications by breaking down pieces of work into issues. Issues can represent tasks, software bugs, feature requests or any other type of project work.</p><p><br></p><h3>Jira Software&nbsp;(software projects) issue types:</h3><p><br></p><h1><strong>Bug </strong><span style="background-color: initial;">🐞</span></h1><p>A bug is a problem which impairs or prevents the functions of a product.</p><p><br></p><h1><strong>Story </strong><span style="color: rgb(51, 51, 51);">📗</span></h1><p>A user story is the smallest unit of work that needs to be done.</p><p><br></p><h1><strong>Task </strong><span style="color: rgb(51, 51, 51);">🗳</span></h1><p>A task represents work that needs to be done.</p>`,
      estimate: 8,
      timeSpend: 4,
      projectId: project.id,
      reportedId: users[1].id,
      users: {
        connect: [{ id: users[0].id }],
      },
    },
    {
      title: "Click on an issue to see what's behind it.",
      type: IssueType.TASK,
      status: IssueStatus.BACKLOG,
      priority: IssuePriority.LOW,
      listPosition: 2,
      description: `<h2>Key terms to know</h2><p><br></p><h3>Issues</h3><p>A Jira 'issue' refers to a single work item of any type or size that is tracked from creation to completion. For example, an issue could be a feature being developed by a software team, a to-do item for a marketing team, or a contract that needs to be written by a legal team.</p><p><br></p><h3>Projects</h3><p>A project is, quite simply, a collection of issues that are held in common by purpose or context. Issues grouped into projects can be configured in a variety of ways, ranging from visibility restrictions to available workflows.</p><p><br></p><h3>Workflows</h3><p>Workflows represent the&nbsp;sequential&nbsp;path an issues takes from creation to completion. A basic workflow might look something like this:</p><p><br></p><p><img src="https://wac-cdn.atlassian.com/dam/jcr:6203a73b-f2a1-4d91-9587-bc4b7d822d6b/workflow_timeline_desktop-temporary.svg?cdnVersion=736" alt="Jira workflow diagram"></p><p><br></p><p>In this case, Open, Done, and the labels in between represent the status an issue can take, while the arrows represent potential transitions from one status to another.</p><p><br></p><h3>Agile</h3><p>Agile is not a Jira Software-specific term. It's a work philosophy that originated in the software development field and has since expanded to a variety of other industries. While we won't belabor the definition here (there are&nbsp;great resources for that!), agile emphasizes an iterative approach to work informed by customer feedback where delivery occurs incrementally and continuously. The ideal agile team can move quickly and adapt to changing requirements without missing much of a beat.</p><p><br></p><h3>Server</h3><p>With&nbsp;Jira Software Server,&nbsp;you host Jira Software on your own hardware and customize your setup however you'd like. This is generally the best option for teams who need to manage all the details,&nbsp;have stricter requirements for data governance,&nbsp;and don't mind the additional complexity of hosting themselves.</p><p><br></p><p><img src="https://wac-cdn.atlassian.com/dam/jcr:4a1b934f-38b4-456e-b807-29e93935e00f/Server%20Cluster@2x.png?cdnVersion=736" alt="Data Center"></p><p><br></p><h3>Data Center</h3><p><br></p><h3>With&nbsp;Jira Software Data Center, you can host Jira Software on your own hardware or with IaaS vendors like&nbsp;<a href="https://www.atlassian.com/enterprise/data-center/aws" rel="noopener noreferrer" target="_blank">AWS</a>&nbsp;and&nbsp;<a href="https://www.atlassian.com/enterprise/data-center/azure" rel="noopener noreferrer" target="_blank">Azure</a>. This is generally the best option for enterprise teams who need uninterrupted access to Jira Software and performance at scale.</h3><p><br></p>`,
      estimate: 5,
      timeSpend: 2,
      projectId: project.id,
      reportedId: users[2].id,
      users: {
        connect: [{ id: users[0].id }],
      },
    },
    {
      title:
        'Try dragging issues to different columns to transition their status.',
      type: IssueType.STORY,
      status: IssueStatus.BACKLOG,
      priority: IssuePriority.MEDIUM,
      listPosition: 3,
      description: `<p>An issue's status indicates its current place in the project's workflow. Here's a list of the statuses that come with&nbsp;JIRA products, depending on what projects you've created on your site.</p><p><br></p><h3>Jira software issue statuses:</h3><p><br></p><h2><strong style="background-color: rgb(187, 187, 187);"> Backlog </strong></h2><p>The issue is waiting to be picked up in a future sprint.</p><p><br></p><h2><strong style="background-color: rgb(187, 187, 187);"> Selected </strong></h2><p>The issue is open and ready for the assignee to start work on it.</p><p><br></p><h2><strong style="background-color: rgb(0, 102, 204); color: rgb(255, 255, 255);"> In Progress </strong></h2><p>This issue is being actively worked on at the moment by the assignee.</p><p><br></p><h2><strong style="background-color: rgb(0, 138, 0); color: rgb(255, 255, 255);"> Done </strong></h2><p>Work has finished on the issue.</p>`,
      estimate: 15,
      timeSpend: 12,
      projectId: project.id,
      reportedId: users[1].id,
    },
    {
      title: 'You can use rich text with images in issue descriptions.',
      type: IssueType.STORY,
      status: IssueStatus.BACKLOG,
      priority: IssuePriority.LOWEST,
      listPosition: 4,
      description: `<h1><span style="color: rgb(51, 51, 51);">🍏 🍎 🍐 🍊 🍋 🍌 🍉 🍇 🍓 🍈 🍒 🍑 🍍 🥭 🥥 🥝 🍅 🍆 🥑 🥦 🥒 🥬 🌶 🌽 🥕 🥔 🍠 🥐 🍞 🥖 🥨 🥯 🧀 🥚 🍳 🥞 🥓 🥩 🍗 🍖 🌭 🍔 🍟 🍕 🥪 🥙 🌮 🌯 🥗 🥘 🥫 🍝 🍜 🍲 🍛 🍣 🍱 🥟 🍤 🍙 🍚 🍘 🍥 🥮 🥠 🍢 🍡 🍧 🍨 🍦 🥧 🍰 🎂 🍮 🍭 🍬 🍫 🍿 🧂 🍩 🍪 🌰 🥜 🍯 🥛 🍼 ☕️ 🍵 🥤 🍶 🍺 🍻 🥂 🍷 🥃 🍸 🍹 🍾 🥄 🍴 🍽 🥣 🥡 🥢</span></h1>`,
      estimate: 4,
      timeSpend: 4,
      projectId: project.id,
      reportedId: users[2].id,
      users: {
        connect: [{ id: users[2].id }],
      },
    },
    {
      title: 'Each issue can be assigned priority from lowest to highest.',
      type: IssueType.TASK,
      status: IssueStatus.SELECTED,
      priority: IssuePriority.HIGHEST,
      listPosition: 5,
      description: `<p>An issue's priority indicates its relative importance. The default priorities are listed below. Both the priorities and their meanings can be&nbsp;customized by your administrator to suit your organization.&nbsp;<a href="https://confluence.atlassian.com/adminjiracloud/configuring-statuses-resolutions-and-priorities-776636333.html" rel="noopener noreferrer" target="_blank">Learn more about configuring priorities and their descriptions</a>.</p><p><br></p><h3>Jira software issue priorities:</h3><p><br></p><h3><strong style="background-color: rgb(230, 0, 0); color: rgb(255, 255, 255);"> Highest </strong><strong style="color: rgb(255, 255, 255);"> </strong><span style="color: rgb(51, 51, 51);">⬆️</span></h3><p>This problem will block progress.</p><p><br></p><h3><strong style="background-color: rgb(240, 102, 102); color: rgb(255, 255, 255);"> High </strong><strong style="color: rgb(255, 255, 255);"> </strong><span style="color: rgb(51, 51, 51);">⬆️</span></h3><p>Serious problem that could block progress.</p><p><br></p><h3><strong style="background-color: rgb(255, 153, 0); color: rgb(255, 255, 255);"> Medium </strong><strong style="color: rgb(255, 255, 255);"> </strong><span style="color: rgb(51, 51, 51);">⬆️</span></h3><p>Has the potential to affect progress.</p><p><br></p><h3><strong style="background-color: rgb(0, 138, 0); color: rgb(255, 255, 255);"> Low </strong><strong style="color: rgb(255, 255, 255);"> </strong><span style="color: rgb(51, 51, 51);">⬇️</span></h3><p>Minor problem or easily worked around.</p><p><br></p><h3><strong style="background-color: rgb(102, 185, 102); color: rgb(255, 255, 255);"> Lowest </strong><strong style="color: rgb(255, 255, 255);"> </strong><span style="color: rgb(51, 51, 51);">⬇️</span></h3><p>Trivial problem with little or no impact on progress.</p>`,
      estimate: 4,
      timeSpend: 1,
      projectId: project.id,
      reportedId: users[2].id,
    },
    {
      title:
        'Each issue has a single reporter but can have multiple assignees.',
      type: IssueType.STORY,
      status: IssueStatus.SELECTED,
      priority: IssuePriority.HIGH,
      listPosition: 6,
      description: `<h2>Try assigning <u style="background-color: rgb(204, 232, 204);">Pickle Rick</u> to this issue. <span style="color: rgb(51, 51, 51);">🥒&nbsp;🥒&nbsp;🥒</span></h2><p><br></p>`,
      estimate: 6,
      timeSpend: 3,
      reportedId: users[2].id,
      projectId: project.id,
      users: {
        connect: [{ id: users[2].id }, { id: users[0].id }],
      },
    },
    {
      title:
        'You can track how many hours were spent working on an issue, and how many hours remain.',
      type: IssueType.TASK,
      status: IssueStatus.INPROGRESS,
      priority: IssuePriority.LOWEST,
      listPosition: 7,
      description: `<p>Before you start work on an issue, you can set a time or other type of estimate to calculate how much work you believe it'll take to resolve it. Once you've started to work on a specific issue, log time to keep a record of it.</p><p><br></p><ul><li>Open the issue and select&nbsp;••• &gt;&nbsp;Time tracking</li><li>Fill in the<strong>&nbsp;Time Spent</strong>&nbsp;field</li><li>Fill in the <strong>Time Remaining</strong> field and click Save</li></ul><p><br></p><h3><u style="background-color: initial;">That's it!</u></h3><h1>💯💯</h1>`,
      estimate: 12,
      timeSpend: 11,
      projectId: project.id,
      reportedId: users[0].id,
    },
    {
      title: 'Try leaving a comment on this issue.',
      type: IssueType.TASK,
      status: IssueStatus.DONE,
      priority: IssuePriority.MEDIUM,
      listPosition: 8,
      description: `<p>Adding comments to an issue is a useful way to record additional detail about an issue, and collaborate with team members. Comments are shown in the&nbsp;<strong>Comments</strong>&nbsp;section when you&nbsp;<a href="https://confluence.atlassian.com/jira064/what-is-an-issue-720416138.html" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 82, 204); background-color: rgb(255, 255, 255);">view an issue</a>.</p><p><br></p><ol><li>Open the&nbsp;<a href="https://confluence.atlassian.com/jira064/what-is-an-issue-720416138.html" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 82, 204);">issue</a>&nbsp;on which to add your comment.</li><li>Click the&nbsp;<strong>Add a comment</strong>&nbsp;button.</li><li class="ql-indent-1"><img src="https://confluence.atlassian.com/s/en_GB/7901/af536c7c6dffcc1d697b914b797aa7f2f306b4f8/_/images/icons/emoticons/check.svg" alt="(tick)">&nbsp;<a href="https://confluence.atlassian.com/jira064/using-keyboard-shortcuts-720416165.html#UsingKeyboardShortcuts-issues" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 82, 204);">Keyboard shortcut</a>:&nbsp;<strong>m</strong></li><li>In the&nbsp;<strong>Comment</strong>&nbsp;text box, type your comment, using as many lines as you require.&nbsp;<img src="https://confluence.atlassian.com/s/en_GB/7901/af536c7c6dffcc1d697b914b797aa7f2f306b4f8/_/images/icons/emoticons/check.svg" alt="(tick)">&nbsp;</li><li>Click the&nbsp;<strong>Save</strong>&nbsp;button to save the comment.</li></ol>`,
      estimate: 10,
      timeSpend: 2,
      projectId: project.id,
      reportedId: users[0].id,
      users: {
        connect: [{ id: users[1].id }, { id: users[0].id }],
      },
    },
  ];

  return Promise.all(issueData.map((data) => tx.issue.create({ data })));
};

const seedComments = async (
  tx: any,
  issues: Issue[],
  users: User[],
): Promise<Comment[]> => {
  const commentData = [
    {
      body: 'An old silent pond...\nA frog jumps into the pond,\nsplash! Silence again.',
      issueId: issues[0].id,
      userId: users[2].id,
    },
    {
      body: 'Autumn moonlight-\na worm digs silently\ninto the chestnut.',
      issueId: issues[1].id,
      userId: users[2].id,
    },
    {
      body: 'In the twilight rain\nthese brilliant-hued hibiscus -\nA lovely sunset.',
      issueId: issues[2].id,
      userId: users[2].id,
    },
    {
      body: 'A summer river being crossed\nhow pleasing\nwith sandals in my hands!',
      issueId: issues[3].id,
      userId: users[2].id,
    },
    {
      body: "Light of the moon\nMoves west, flowers' shadows\nCreep eastward.",
      issueId: issues[4].id,
      userId: users[2].id,
    },
    {
      body: 'In the moonlight,\nThe color and scent of the wisteria\nSeems far away.',
      issueId: issues[5].id,
      userId: users[2].id,
    },
    {
      body: 'O snail\nClimb Mount Fuji,\nBut slowly, slowly!',
      issueId: issues[6].id,
      userId: users[2].id,
    },
    {
      body: 'Everything I touch\nwith tenderness, alas,\npricks like a bramble.',
      issueId: issues[7].id,
      userId: users[2].id,
    },
  ];

  return Promise.all(commentData.map((data) => tx.comment.create({ data })));
};
