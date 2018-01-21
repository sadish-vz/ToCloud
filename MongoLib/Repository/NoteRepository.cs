using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoLib.Context;
using MongoLib.Interface;
using MongoLib.Model;
using System;

namespace MongoLib.Repository
{
    public class NoteRepository : INoteRepository
    {
        private readonly INoteContext _context = null;

        public NoteRepository(INoteContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<Note>> GetAllNotes()
        {
            return await _context.Notes.Find(_ => true).ToListAsync();
        }

        public async Task<Note> GetNote(string id)
        {
            var filter = Builders<Note>.Filter.Eq("Id", id);
            return await _context.Notes
                                 .Find(filter)
                                 .FirstOrDefaultAsync();
        }

        public async Task AddNote(Note item)
        {
            await _context.Notes.InsertOneAsync(item);
        }

        public async Task<DeleteResult> RemoveNote(string id)
        {
            return await _context.Notes.DeleteOneAsync(
                         Builders<Note>.Filter.Eq("Id", id));
        }

        public async Task<UpdateResult> UpdateNote(string id, string body)
        {
            var filter = Builders<Note>.Filter.Eq(s => s.Id, id);
            var update = Builders<Note>.Update
                                .Set(s => s.Body, body)
                                .CurrentDate(s => s.UpdatedOn);
            return await _context.Notes.UpdateOneAsync(filter, update);
        }

        public async Task<ReplaceOneResult> UpdateNote(string id, Note item)
        {
            return await _context.Notes
                                 .ReplaceOneAsync(n => n.Id.Equals(id)
                                                     , item
                                                     , new UpdateOptions { IsUpsert = true });
        }

        public async Task<DeleteResult> RemoveAllNotes()
        {
            return await _context.Notes.DeleteManyAsync(new BsonDocument());
        }

        public Task<ReplaceOneResult> UpdateNoteDocument(string id, string body)
        {
            throw new System.NotImplementedException();
        }
    }
}