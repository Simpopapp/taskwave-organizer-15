import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Heart, Share2 } from "lucide-react";
import { useState } from "react";

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  likes: number;
  comments: number;
  timestamp: Date;
}

export default function Team() {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: {
        name: "João Silva",
        avatar: "https://github.com/shadcn.png",
      },
      content: "Acabei de completar todas as missões do dia! 🎉",
      likes: 5,
      comments: 2,
      timestamp: new Date(),
    },
  ]);

  const handlePost = () => {
    if (!newPost.trim()) return;
    
    const post: Post = {
      id: Date.now().toString(),
      author: {
        name: "Você",
        avatar: "https://github.com/shadcn.png",
      },
      content: newPost,
      likes: 0,
      comments: 0,
      timestamp: new Date(),
    };

    setPosts([post, ...posts]);
    setNewPost("");
  };

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-2xl">
      <Card className="p-4">
        <Textarea
          placeholder="Compartilhe algo com sua equipe..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handlePost} className="w-full sm:w-auto">
          Publicar
        </Button>
      </Card>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <img src={post.author.avatar} alt={post.author.name} />
              </Avatar>
              <div>
                <h3 className="font-medium">{post.author.name}</h3>
                <p className="text-sm text-gray-500">
                  {post.timestamp.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="mb-4">{post.content}</p>
            <div className="flex gap-4 text-gray-500">
              <Button variant="ghost" size="sm" className="gap-2">
                <Heart className="w-4 h-4" />
                {post.likes}
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                {post.comments}
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Compartilhar
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}