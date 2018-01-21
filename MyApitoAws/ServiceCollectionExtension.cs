using Microsoft.Extensions.DependencyInjection;
using MongoLib.Repository;
using MongoLib.Context;
using MongoLib.Interface;

namespace MyApitoAws
{
    public static class ServiceCollectionExtension
    {
        public static IServiceCollection AddDI(this IServiceCollection services){
            services.AddTransient<INoteContext, NoteContext>();
            services.AddTransient<INoteRepository,NoteRepository>();

            return services;
        }
    }
}