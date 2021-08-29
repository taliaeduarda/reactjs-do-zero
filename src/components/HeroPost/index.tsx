import Link from 'next/link';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { AiOutlineCalendar } from 'react-icons/ai';
import { BsPerson } from 'react-icons/bs';

interface Post {
  uid: string;
  date: string | null;
  title: string;
  subtitle: string;
  author: string;
}

export function HeroPost({ uid, date, title, subtitle, author }: Post) {
  return (
      <div>
        <Link href={`/post/${uid}`} key={uid}>
          <a>
            <strong>{title}</strong>
          </a>
        </Link>
        <div>
          <p>{subtitle}</p>
          <AiOutlineCalendar size="1.5rem" />
          <time>
            {format(new Date(date), 'dd MMM yyyy', {
              locale: ptBR,
            })}
          </time>
          <BsPerson size="1.5rem" />
          <span>{author}</span>
        </div>
      </div>
  );
}
