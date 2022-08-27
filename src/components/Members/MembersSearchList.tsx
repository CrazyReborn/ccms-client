import { format } from "date-fns";
import { useState } from "react";
import { userTasksForToday } from "../UsersMini";

export default function MembersSearchList({ members, setActive }: any) {
  const [filter, setFilter] = useState('');

  return (
    <div className='members-search-and-list'>
       <h1>Members</h1>
       <p>{format(new Date(), 'MMMM do, u')}</p>
        <div className='search-and-create'>
          <input type='search' onChange={(e) => setFilter(e.target.value)}/>
        </div>
        {members.length === 0 ?
        <p>No members in your organization</p>
        :
        members.map((member: any, index: number) => {
          return (
            <div key={`${member['_id']}${index}`} className='individual-member' onClick={() => setActive(member)}>
              <p>{member['firstName']} {member['lastName']}</p>
            </div>
          )
        })

          }
    </div>
  )
}