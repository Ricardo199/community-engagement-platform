import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      refreshToken
      user {
        _id
        username
        email
        role
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!, $role: String!) {
    signup(username: $username, email: $email, password: $password, role: $role) {
      accessToken
      refreshToken
      user {
        _id
        username
        email
        role
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      _id
      username
      email
      role
    }
  }
`;

// Community Operations
export const GET_POSTS_QUERY = gql`
  query Posts($category: String) {
    posts(category: $category) {
      _id
      title
      content
      category
      aiSummary
      createdAt
      author {
        username
      }
    }
  }
`;

export const GET_POST_QUERY = gql`
  query Post($_id: ID!) {
    post(_id: $_id) {
      _id
      title
      content
      category
      aiSummary
      createdAt
      updatedAt
      author {
        username
        email
      }
    }
  }
`;

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($title: String!, $content: String!, $category: String!) {
    createPost(title: $title, content: $content, category: $category) {
      _id
      title
      content
      category
      createdAt
      author {
        username
      }
    }
  }
`;

export const UPDATE_POST_MUTATION = gql`
  mutation UpdatePost($_id: ID!, $title: String, $content: String, $category: String) {
    updatePost(_id: $_id, title: $title, content: $content, category: $category) {
      _id
      title
      content
      category
      updatedAt
    }
  }
`;

export const DELETE_POST_MUTATION = gql`
  mutation DeletePost($_id: ID!) {
    deletePost(_id: $_id)
  }
`;

export const GET_HELP_REQUESTS_QUERY = gql`
  query HelpRequests($isResolved: Boolean) {
    helpRequests(isResolved: $isResolved) {
      _id
      description
      location
      isResolved
      createdAt
      author {
        username
      }
      volunteers {
        username
      }
    }
  }
`;

export const GET_HELP_REQUEST_QUERY = gql`
  query HelpRequest($_id: ID!) {
    helpRequest(_id: $_id) {
      _id
      description
      location
      isResolved
      createdAt
      updatedAt
      author {
        username
        email
      }
      volunteers {
        username
      }
    }
  }
`;

export const CREATE_HELP_REQUEST_MUTATION = gql`
  mutation CreateHelpRequest($description: String!, $location: String) {
    createHelpRequest(description: $description, location: $location) {
      _id
      description
      location
      isResolved
      createdAt
      author {
        username
      }
    }
  }
`;

export const RESOLVE_HELP_REQUEST_MUTATION = gql`
  mutation ResolveHelpRequest($_id: ID!) {
    resolveHelpRequest(_id: $_id) {
      _id
      isResolved
      updatedAt
    }
  }
`;

export const VOLUNTEER_FOR_HELP_REQUEST_MUTATION = gql`
  mutation VolunteerForHelpRequest($_id: ID!) {
    volunteerForHelpRequest(_id: $_id) {
      _id
      volunteers {
        username
      }
    }
  }
`;