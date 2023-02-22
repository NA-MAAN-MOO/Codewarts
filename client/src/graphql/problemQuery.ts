export default `
query ($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
      questionId
      questionFrontendId
      title
      titleSlug
      content
      difficulty
      likes
      dislikes
      exampleTestcases
      topicTags {
          name
          slug
          translatedName
      }
      codeSnippets {
          lang
          langSlug
          code
      }
      stats
      metaData
      enableRunCode
      enableTestMode
      enableDebugger
    }
  }
`;
