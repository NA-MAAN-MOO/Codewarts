export default `
query ($username: String!) {
  matchedUser(username: $username) {
      username
      socialAccounts
      githubUrl
      profile {
          realName

          ranking
      }
      submitStats {
          acSubmissionNum {
              difficulty
              count
          }
          totalSubmissionNum {
              difficulty
              count
              # submissions
          }
      }
      badges {
          id
          displayName
          icon
          creationDate
      }
  }
  recentSubmissionList(username: $username, limit: 20) {
      title
      titleSlug
      timestamp
      statusDisplay
      lang
  }
}
`;
