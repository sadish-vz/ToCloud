using MongoDB.Driver;
using MongoLib.Model;

namespace MongoLib.Interface {
    public interface INoteContext {
        IMongoCollection<Note> Notes { get; }
    }
}