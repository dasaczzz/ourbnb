interface GraphNode {
  id: string;
  type: 'review' | 'user' | 'post';
  data: any;
}

interface GraphEdge {
  from: string;
  to: string;
  relation: string;
}

interface Review {
  id: string;
  comment: string;
  date_review: {
    $date: string;
  };
  qualification: number;
  user_id: {
    $oid: string;
  };
  post_id: string;
  user: {
    name: string;
    profilepic: string;
  };
}

interface ReviewGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/**
 * Transforms an array of reviews into a graph data structure.
 * Nodes represent reviews, users, and posts.
 * Edges represent relationships: user wrote review, review belongs to post.
 * 
 * @param reviews Array of reviews
 * @param postId The post id to which reviews belong
 * @returns ReviewGraph object with nodes and edges
 */
export function buildReviewGraph(reviews: Review[], postId: string): ReviewGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Add post node
  nodes.push({
    id: postId,
    type: 'post',
    data: { id: postId }
  });

  // Track added users to avoid duplicates
  const userIds = new Set<string>();

  for (const review of reviews) {
    // Add review node
    nodes.push({
      id: review.id,
      type: 'review',
      data: review
    });

    // Add edge: review belongs to post
    edges.push({
      from: review.id,
      to: postId,
      relation: 'belongs_to'
    });

    // Add user node if not added
    const userId = review.user_id.$oid;
    if (!userIds.has(userId)) {
      nodes.push({
        id: userId,
        type: 'user',
        data: {
          id: userId,
          name: review.user.name,
          profilepic: review.user.profilepic
        }
      });
      userIds.add(userId);
    }

    // Add edge: user wrote review
    edges.push({
      from: userId,
      to: review.id,
      relation: 'wrote'
    });
  }

  // Add edges between reviews with the same qualification
  for (let i = 0; i < reviews.length; i++) {
    for (let j = i + 1; j < reviews.length; j++) {
      if (reviews[i].qualification === reviews[j].qualification) {
        edges.push({
          from: reviews[i].id,
          to: reviews[j].id,
          relation: 'same_qualification'
        });
        edges.push({
          from: reviews[j].id,
          to: reviews[i].id,
          relation: 'same_qualification'
        });
      }
    }
  }

  return { nodes, edges };
}
