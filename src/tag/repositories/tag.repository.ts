import { Repository } from 'typeorm'
import { CustomRepository } from '../../common/repositories/typeorm-ex.decorator'
import { Tag } from '../entities/tag.entity'

@CustomRepository(Tag)
export class TagRepository extends Repository<Tag> {
  async getOrCreate(name: string): Promise<Tag> {
    const tagName = name.trim().toLowerCase()
    const tagSlug = tagName.replace(/ /g, '-')
    let tag = await this.findOne({
      where: {
        name: tagName,
      },
    })
    if (!tag) {
      tag = await this.save(this.create({ name: tagName, slug: tagSlug }))
    }
    return tag
  }
}
