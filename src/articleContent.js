// Local editorial reading guides. Original articles and member services remain linked.
export const readingGuides = {
  'what-is-the-n8n-hype': {
    lead: 'Connect your tools. Let a workflow carry the repetitive work.',
    sections: [
      { id: 'what-it-does', title: 'From separate apps to one workflow', paragraphs: ['n8n is a workflow automation tool. It connects services so that an event in one place can start a sequence of actions elsewhere. A workflow might collect a form response, organize its data, and notify a team.', 'Visual steps make the sequence easier to inspect. Each step takes an input, performs a task, and passes a result onward.'] },
      { id: 'build-a-small-loop', title: 'Start with one useful connection', paragraphs: ['Choose a repetitive task with a clear trigger and outcome. Connect the required services and check each step with sample data.', 'n8n itself is not an AI agent. It can coordinate workflows and give an agent access to tools. Check outputs, permissions, and failures before relying on the result.'] },
      { id: 'takeaway', title: 'The useful idea', paragraphs: ['Automation helps different tools cooperate. Begin with a small workflow you can understand and verify, then extend it when it reliably solves a real problem.'] },
    ],
  },
  'neural-networks-the-technology-behind-modern-ai': {
    lead: 'Learning from examples connects simple calculations to powerful pattern recognition.',
    sections: [
      { id: 'patterns', title: 'Learning patterns from data', paragraphs: ['A neural network learns relationships in examples instead of relying only on rules written by hand. Its connected layers transform an input into a prediction or another useful output.', 'During training, the network compares its output with a target and adjusts numerical weights to reduce errors. Repeating that process can help it recognize patterns.'] },
      { id: 'layers', title: 'Many small steps', paragraphs: ['An individual unit performs a simple calculation. Layers combine many such calculations, allowing later stages to work with representations built by earlier stages.', 'The same broad idea supports systems for images, speech, recommendations, and text. Their architectures, training data, and purposes differ.'] },
      { id: 'limits', title: 'Good examples still matter', paragraphs: ['A network can learn misleading patterns as well as useful ones. Performance on familiar examples is not enough: evaluate it on data it has not trained on.', 'The practical lesson is to treat data quality, evaluation, and the intended task as part of the design.'] },
    ],
  },
  'what-is-an-api-the-invisible-messenger-behind-modern-apps': {
    lead: 'Apps exchange information through APIs. A clear interface lets each service do its job.',
    diagram: true,
    sections: [
      { id: 'request-response', title: 'A request. A response.', paragraphs: ['An application programming interface gives software a defined way to communicate. One application sends a request, a service processes it, and a response returns information or the result of an action.', 'For a weather app, that might mean sending a location and receiving forecast data. The app turns that response into something a person can read.'] },
      { id: 'clear-boundary', title: 'A useful boundary', paragraphs: ['The caller does not need direct access to the service’s internal database or implementation. It works with the operations and data that the interface exposes.', 'Parameters describe the request. Authentication may identify the caller, while permissions determine which actions or information are available.'] },
      { id: 'why-it-matters', title: 'Why it matters', paragraphs: ['Maps, sign-in services, payments, and connected AI tools use APIs to exchange structured information. Developers can combine specialized services instead of rebuilding every capability.', 'The key idea is the exchange: an agreed request goes in, and a usable response comes back.'] },
    ],
  },
  'what-are-ai-agents-and-how-are-they-impacting-the-world': {
    lead: 'Some AI systems can use tools and take steps toward a goal, beyond producing a reply.',
    sections: [
      { id: 'beyond-a-reply', title: 'Beyond a reply', paragraphs: ['An AI agent combines a model with tools and a process for working toward an objective. It may choose an action, inspect the result, and decide what to do next.', 'A conversational response can be one part of that process. Tools let a system retrieve information or perform a permitted task in another service.'] },
      { id: 'the-loop', title: 'Act, observe, adjust', paragraphs: ['A typical loop starts with a goal and the information available. The system chooses a step, receives feedback, and uses that feedback to continue or stop.', 'Search, coding, and workflow assistance are examples of tasks where this pattern can be useful. The amount of autonomy depends on the system and the task.'] },
      { id: 'human-judgment', title: 'Keep the outcome in view', paragraphs: ['Tool access does not guarantee a correct decision. Clear permissions, reliable feedback, and human review matter when an action has consequences.', 'Judge an agent by whether it completes a useful task correctly and within its boundaries, rather than by how many actions it takes.'] },
    ],
  },
};
